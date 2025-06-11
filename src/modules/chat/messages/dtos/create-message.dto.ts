import { IsEnum, IsMongoId, IsString } from 'class-validator';
import { MessageType } from '../enums/message-type.enum';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsMongoId()
  conversation: Types.ObjectId;

  @IsString()
  text: string;

  @IsEnum(MessageType)
  type: MessageType;
}
