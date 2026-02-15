import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { AttachmentType } from '../enums/attachment_type.enum';

export type AttachmentDocument = HydratedDocument<Attachment>;

@Schema()
export class Attachment {
  @Prop({
    required: true,
  })
  file: string;

  @Prop({
    required: true,
  })
  thumb: string;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;

  @Prop({
    default: new Date(),
  })
  updatedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  })
  parentMessage?: Types.ObjectId; // Para mensajes que son respuestas

  @Prop({ required: true })
  type: AttachmentType;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
