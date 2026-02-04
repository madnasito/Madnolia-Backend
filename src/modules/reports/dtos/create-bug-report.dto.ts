import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BugReportType } from '../enums/bug-report-type.enum';

export class CreateBugReportDto {
  @IsEnum(BugReportType)
  @Type(() => Number)
  @IsNotEmpty()
  type: BugReportType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  media: any;
}
