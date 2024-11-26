import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMatchDto {
  @IsString()
  @MaxLength(40)
  title: string;

  @IsInt()
  platform: number;

  @IsInt()
  game: number;

  @IsNumber()
  @Min(new Date().getTime())
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
