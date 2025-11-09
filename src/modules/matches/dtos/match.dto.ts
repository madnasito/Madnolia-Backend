import {
  IsArray,
  IsDefined,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

export class MatchDto {
  @IsOptional()
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsMongoId()
  user: Types.ObjectId;

  @IsEnum(Platform)
  platform: Platform;

  @IsMongoId()
  game: string;

  @IsDate()
  date: Date;

  @IsArray()
  inviteds: Array<Types.ObjectId>;

  @IsArray()
  joined: Array<Types.ObjectId>;

  @IsString()
  @IsOptional()
  tournament: string;
}
