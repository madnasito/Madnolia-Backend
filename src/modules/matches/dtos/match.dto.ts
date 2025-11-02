import {
  IsArray,
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

export class MatchDto {
  @IsOptional()
  @IsMongoId()
  _id: ObjectId;

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

  @IsNumber()
  date: number;

  @IsArray()
  inviteds: Array<string>;

  @IsArray()
  joined: Array<Types.ObjectId>;

  @IsString()
  @IsOptional()
  tournament: string;
}
