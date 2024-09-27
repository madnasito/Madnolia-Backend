import { IsAlphanumeric, IsArray, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsAlphanumeric()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsArray()
    @IsOptional()
    platforms: Array<number>

    @IsString()
    @IsOptional()
    img: string

    @IsString()
    @IsOptional()
    thumb: string
}