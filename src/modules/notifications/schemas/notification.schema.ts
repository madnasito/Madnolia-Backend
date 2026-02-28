import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { NotificationType } from '../enums/notification-type.enum';
// import { User } from 'src/modules/users/schemas/user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    enum: NotificationType,
  })
  type: NotificationType;

  @Prop({
    required: true,
    type: String,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
  })
  thumb: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  sender: Types.ObjectId | string;

  @Prop({
    type: String,
  })
  path: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;

  @Prop({
    default: new Date(),
  })
  date: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
