import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { FriendshipStatus } from '../enums/friendship-status.enum';

export class CreateFriendshipDto {
  @IsNotEmpty()
  @IsMongoId()
  user1: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  user2: Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus;
}
