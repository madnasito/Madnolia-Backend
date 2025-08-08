import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UserGroupDto {
  @IsNotEmpty()
  @IsMongoId()
  user: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  group: string;
}
