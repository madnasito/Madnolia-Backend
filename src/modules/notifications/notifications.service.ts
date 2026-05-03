import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(payload: CreateNotificationDto) {
    const newNotification = new this.notificationModel(payload);
    newNotification.date = new Date(new Date().toUTCString());

    const savedNotification = await newNotification.save();
    this.eventEmitter.emit('notification.created', savedNotification);

    return savedNotification;
  }

  deleteById = (id: Types.ObjectId) =>
    this.notificationModel.findOneAndDelete({ _id: id });

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
      } as any,
      { new: true },
    );

  readAllUserNotifications = (user: Types.ObjectId) =>
    this.notificationModel.updateMany({ user }, { read: true });

  getUserNotifications = async (
    user: Types.ObjectId,
    cursor: string | null,
  ): Promise<Array<Notification>> => {
    const limit = 20;
    const query: any = {
      user,
    };

    if (cursor) {
      if (!Types.ObjectId.isValid(cursor)) {
        throw new BadRequestException('invalid_cursor');
      }
      query._id = { $lt: cursor };
    }

    return this.notificationModel.find(query, {}, { sort: { _id: -1 }, limit });
  };

  getUserUnreadNotificationsCount = (user: Types.ObjectId) =>
    this.notificationModel.countDocuments({ user, read: false });

  deleteUserNotification = (id: Types.ObjectId, user: Types.ObjectId) =>
    this.notificationModel.findOneAndDelete({ _id: id, user }, { new: true });

  deleteUserNotifications = (
    user: Types.ObjectId,
  ): Promise<{ acknowledged: boolean; deletedCount: number }> =>
    this.notificationModel.deleteMany({
      $or: [{ user }, { sender: user }],
    } as any);
}
