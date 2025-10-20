import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class SyncMessagesDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number = 300;
}
