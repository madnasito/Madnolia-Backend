import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageRecipientDto {
  @IsMongoId()
  message: Types.ObjectId;

  @IsMongoId()
  conversation: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  user?: Types.ObjectId;
}
