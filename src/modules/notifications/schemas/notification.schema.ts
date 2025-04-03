import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({
    required: true,
    Type: Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    required: true,
    type: NotificationType,
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
  subTitle: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
