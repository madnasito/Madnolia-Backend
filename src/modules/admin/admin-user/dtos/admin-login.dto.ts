import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminLoginDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}