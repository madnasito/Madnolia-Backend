import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';
import { MatchStatus } from '../enums/status.enum';
import { MatchesSortBy } from '../enums/matches-sort.enum';

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
  sort: mongoose.SortOrder;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsEnum(MatchesSortBy)
  sortBy?: MatchesSortBy = MatchesSortBy.DATE;

  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;

  @IsOptional()
  @IsArray()
  status?: MatchStatus[];
}
