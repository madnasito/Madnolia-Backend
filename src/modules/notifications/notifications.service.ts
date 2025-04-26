import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model, Types } from 'mongoose';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(payload: CreateNotificationDto) {
    const newNotification = new this.notificationModel(payload);

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
  ): Promise<Array<Notification>> => {
    await this.readAllUserNotifications(user);
    return this.notificationModel.find({ user });
  };

  getUserUnreadNotificationsCount = (user: Types.ObjectId) =>
    this.notificationModel.countDocuments({ user, read: false });
}
