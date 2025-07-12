import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { SortOrder } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

export enum MatchesTypeFilter {
  ALL = 'all',
  CREATED = 'created',
  JOINED = 'joined',
}

export class PlayerMatchesFiltersDto {
  @IsNotEmpty()
  @IsEnum(MatchesTypeFilter)
  type: MatchesTypeFilter;

  @IsNotEmpty()
  sort: SortOrder;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  skip: number = 0;

  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;
}
