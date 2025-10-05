import { IsEnum, IsMongoId, IsString, IsUUID } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsUUID()
  id: string;

  @IsMongoId()
  conversation: Types.ObjectId;

  @IsString()
  content: string;

  @IsEnum(MessageType)
  type: MessageType;
}
