import { IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
