import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
} from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  date: Date;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsArray()
  inviteds: User[];

  @IsOptional()
  @IsArray()
  joined: User[];
}
