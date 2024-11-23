import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Privacy } from '../schema/privacy.enum';

export class UpdateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(25)
  name: string;

  @IsString()
  @MaxLength(100)
  description: string;

  @IsEnum(Privacy)
  privacy: Privacy;

  @IsString()
  @IsUrl()
  icon: string;

  @IsString()
  @IsUrl()
  banner: string;
}
