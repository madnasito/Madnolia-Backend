import { IsArray, isArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email:string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsArray()
    platforms: Array<number>;
}