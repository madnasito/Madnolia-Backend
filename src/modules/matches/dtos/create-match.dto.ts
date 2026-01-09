import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

export class CreateMatchDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsEnum(Platform)
  platform: Platform;

  @IsInt()
  game: number;

  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => (value < new Date() ? new Date() : value))
  date: Date;

  @IsInt()
  @Min(5)
  @Max(99)
  duration: number;

  @IsArray()
  inviteds: Array<Types.ObjectId>;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsMongoId()
  group: string;
}
