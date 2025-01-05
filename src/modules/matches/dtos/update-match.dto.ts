import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class UpdateMatchDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(new Date().getTime())
  date: number;

  @IsOptional()
  @IsBoolean()
  private: boolean;

  @IsOptional()
  @IsArray()
  inviteds: User[];

  @IsOptional()
  @IsArray()
  joined: User[];
}
