import { IsArray, isArray, IsEmail, IsString } from "class-validator";

export class SignUpDto {
    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsEmail()
    email:string;

    @IsString()
    password: string;

    @IsArray()
    platforms: Array<number>;
}