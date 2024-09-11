import { IsAlphanumeric, IsArray, IsEmail, IsString, IsStrongPassword } from "class-validator";

export class UserDto {

    @IsAlphanumeric()
    name: string;

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsArray()
    matches: [];
   

}