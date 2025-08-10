import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class SendNotificationDto {
  @IsOptional()
  @IsArray()
  tokens?: string[];

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body: string;

  @IsOptional()
  data?: { [key: string]: string };

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
