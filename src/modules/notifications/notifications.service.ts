import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(payload: CreateNotificationDto) {
    const newNotification = new this.notificationModel(payload);
    newNotification.date = new Date(new Date().toUTCString());

    return await newNotification.save();
  }

  deleteById = (id: Types.ObjectId) =>
    this.notificationModel.findOneAndDelete({ id });

  deleteRequestConnection = (
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ) =>
    this.notificationModel.findOneAndDelete(
      {
        $or: [
          { user: sender, path: receiver },
          { user: receiver, path: sender },
        ],
      },
      { new: true },
    );

  readAllUserNotifications = (user: Types.ObjectId) =>
    this.notificationModel.updateMany({ user }, { read: true });

  getUserNotifications = async (
    user: Types.ObjectId,
    cursor: string | null,
  ): Promise<Array<Notification>> => {
    const limit = 20;
    const query: RootFilterQuery<Notification> = {
      user,
    };

    if (cursor) {
      if (!Types.ObjectId.isValid(cursor)) {
        throw new BadRequestException('invalid_cursor');
      }
      query._id = { $lt: cursor };
    }
    await this.readAllUserNotifications(user);
    return this.notificationModel.find(query, {}, { sort: { _id: -1 }, limit });
  };

  getUserUnreadNotificationsCount = (user: Types.ObjectId) =>
    this.notificationModel.countDocuments({ user, read: false });

  deleteUserNotification = (user: Types.ObjectId, id: Types.ObjectId) =>
    this.notificationModel.findOneAndDelete({ _id: id, user }, { new: true });

  deleteUserNotifications = (
    user: Types.ObjectId,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> =>
    this.notificationModel.deleteMany({ $or: [{ user }, { sender: user }] });
}
