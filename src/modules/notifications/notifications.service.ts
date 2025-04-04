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

  create(payload: CreateNotificationDto) {
    const newNotification = new this.notificationModel(payload);

    return newNotification.save();
  }

  deleteById = (id: Types.ObjectId) =>
    this.notificationModel.findOneAndDelete({ id });

  readAllUserNotifications = (user: Types.ObjectId) =>
    this.notificationModel.updateMany({ user }, { read: true });

  getUserNotifications = (user: Types.ObjectId) =>
    this.notificationModel.find({ user }).exec();
}
