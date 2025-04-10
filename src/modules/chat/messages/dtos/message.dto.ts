import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';
import { Types } from 'mongoose';

export class MessageDto {
  @IsMongoId()
  to: Types.ObjectId;

  @IsString()
  text: string;

  @IsMongoId()
  user: Types.ObjectId;

  @IsEnum(MessageType)
  type: MessageType;
}
