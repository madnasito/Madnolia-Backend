import { IsDate, IsEnum, IsMongoId, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { MessageStatus } from '../enums/message-status.enum';
import { MessageType } from '../enums/message-type.enum';

export class MessageRecipientDTO {
  @IsMongoId()
  id: Types.ObjectId;

  @IsMongoId()
  conversation: Types.ObjectId;

  @IsString()
  content: string;

  @IsMongoId()
  creator: Types.ObjectId;

  @IsEnum(MessageType)
  type: MessageType;

  @IsEnum(MessageStatus)
  status: MessageStatus;

  @IsDate()
  date: Date;

  @IsDate()
  updatedAt: Date;
}
