import { IsAlphanumeric, IsArray, IsEmail, IsIn, IsInt, IsLowercase, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsAlphanumeric()
    @IsOptional()
    name: string;

    @IsOptional()
    @IsAlphanumeric()
    @IsLowercase()
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

    @IsInt()
    @IsOptional()
    @IsIn([0, 1, 2])
    availability: number
}