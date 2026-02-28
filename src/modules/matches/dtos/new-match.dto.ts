import {
  IsArray,
  IsDefined,
  IsDate,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinDate,
} from 'class-validator';
import { Types } from 'mongoose';

export class NewMatchDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsMongoId()
  user: Types.ObjectId;

  @IsInt()
  platform: number;

  @IsMongoId()
  game: Types.ObjectId;

  @IsDate()
  @MinDate(new Date())
  date: Date;

  @IsInt()
  @Min(5)
  @Max(99)
  duration: number;

  @IsArray()
  inviteds: Array<Types.ObjectId>;

  @IsString()
  @IsOptional()
  tournament: string | null;

  @IsOptional()
  @IsMongoId()
  group: string | null;

  @IsDate()
  createdAt: Date;
}
