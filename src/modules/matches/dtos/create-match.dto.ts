import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Platform } from 'src/common/enums/platforms.enum';

export class CreateMatchDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsString()
  @MaxLength(80)
  description: string;

  @IsEnum(Platform)
  platform: Platform;

  @IsInt()
  game: number;

  @IsNumber()
  @Min(new Date().getTime(), { message: 'INVALID_DATE' })
  date: number;

  @IsInt()
  @Min(5)
  @Max(99)
  duration: number;

  @IsArray()
  inviteds: Array<string>;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsMongoId()
  group: string;
}
