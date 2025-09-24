import {
  IsArray,
  IsDefined,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class NewMatchDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDefined()
  @IsMongoId()
  user: string;

  @IsInt()
  platform: number;

  @IsMongoId()
  game: string;

  @IsNumber()
  date: number;

  @IsInt()
  @Min(5)
  @Max(99)
  duration: number;

  @IsArray()
  inviteds: Array<string>;

  @IsString()
  @IsOptional()
  tournament: string;

  @IsOptional()
  @IsMongoId()
  group: string;
}
