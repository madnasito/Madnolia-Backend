import { IsOptional, IsString } from 'class-validator';

export class SearchGamesDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  platforms: string;

  @IsOptional()
  @IsString()
  tags: string;

  @IsOptional()
  @IsString()
  key: string;
}
