import {
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsLowercase,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @MaxLength(17)
  name: string;

  @IsAlphanumeric()
  @IsLowercase()
  @Matches(/^[a-z0-9-_@]+$/)
  @MaxLength(20)
  username: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  platforms: [];
}
