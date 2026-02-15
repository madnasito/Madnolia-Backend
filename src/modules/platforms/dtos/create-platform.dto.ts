import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { PlatformParent } from '../enums/platform-parent.enum';

export class CreatePlatformDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsNotEmpty()
  @IsInt()
  apiId: number;

  @IsNotEmpty()
  @IsEnum(PlatformParent)
  parent: PlatformParent;
}
