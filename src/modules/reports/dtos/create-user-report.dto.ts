import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { UserReportType } from '../enums/user-report-type.enum';

export class CreateUserReportDto {
  @IsEnum(UserReportType)
  @Type(() => Number)
  @IsNotEmpty()
  type: UserReportType;

  @IsNotEmpty()
  @IsMongoId()
  to: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  media: any;
}
