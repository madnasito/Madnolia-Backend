import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MessageStatus } from '../enums/message-status.enum';
import { Message } from './messages.schema';

export type MessageRecipientDocument = HydratedDocument<MessageRecipient>;

@Schema()
export class MessageRecipient {
  _id: mongoose.Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Message',
  })
  message: Message;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  conversation: Types.ObjectId;

  @Prop({
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Prop({ type: Date, index: true })
  updatedAt: Date;
}

export const MessageRecipientSchema =
  SchemaFactory.createForClass(MessageRecipient);
