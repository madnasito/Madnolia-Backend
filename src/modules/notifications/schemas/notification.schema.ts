import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({
    required: true,
    Type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: mongoose.Types.ObjectId;

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
    type: String,
  })
  subtitle: string;

  @Prop({
    type: String,
  })
  path: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
