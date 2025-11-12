import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
import { ReportType } from '../enums/report-type.enum';

export class CreateReportDto {
  @IsEnum(['0', '1'])
  @IsNotEmpty()
  type: ReportType;

  @IsMongoId()
  @IsNotEmpty()
  to: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  media: any;
}
