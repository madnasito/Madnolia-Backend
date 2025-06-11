import { IsEnum, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { MessageStatus } from '../enums/message-status.enum';

export class UpdateRecipientStatusDTO {
  @IsMongoId()
  id: Types.ObjectId;

  @IsEnum(MessageStatus)
  status: MessageStatus;
}
