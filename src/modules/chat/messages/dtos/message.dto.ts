import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';
import { Types } from 'mongoose';

export class MessageDto {
  @IsMongoId()
  conversation: Types.ObjectId;

  @IsString()
  text: string;

  @IsMongoId()
  creator: Types.ObjectId;

  @IsEnum(MessageType)
  type: MessageType;

  // @IsEnum(MessageStatus)
  // status: MessageStatus;
}
