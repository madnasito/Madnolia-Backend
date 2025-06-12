import {
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Availability } from '../enums/availability.enum';

export class UpdateUserDto {
  @IsAlphanumeric()
  @IsOptional()
  name: string;

  @IsOptional()
  @Matches(/^[a-z0-9-_@]+$/, { message: 'Invalid username' })
  @MaxLength(20)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsArray()
  @IsOptional()
  platforms: Array<number>;

  @IsString()
  @IsOptional()
  img: string;

  @IsString()
  @IsOptional()
  thumb: string;

  @IsEnum(Availability)
  @IsOptional()
  availability: Availability;
}
