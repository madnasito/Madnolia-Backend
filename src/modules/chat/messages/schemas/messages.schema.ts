import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MessageType } from '../enums/message-type.enum';
// import { User } from 'src/modules/users/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  creator: Types.ObjectId;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    default: new Date(),
  })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  parentMessage?: Types.ObjectId; // Para mensajes que son respuestas

  @Prop({ required: true })
  type: MessageType;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
    default: [],
  })
  attachments: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
