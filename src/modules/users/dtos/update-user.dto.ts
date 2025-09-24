import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Availability } from '../enums/availability.enum';
import { Platform } from 'src/common/enums/platforms.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  name: string;

  @IsOptional()
  @Matches(/^[a-z0-9-_@]+$/, { message: 'Invalid username' })
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  platforms: Array<Platform>;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  thumb: string;

  @IsOptional()
  @IsEnum(Availability)
  availability: Availability;
}
