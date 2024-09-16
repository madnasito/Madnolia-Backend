import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsString, IsUrl } from "class-validator";

export class UserDto {

    @IsString()
    @Expose()
    name: string;

    @IsString()
    @Expose()
    username: string;

    @IsEmail()
    @Expose()
    email: string;

    @IsArray()
    @Expose()
    platforms: Array<Number>

    @IsUrl()
    @Expose()
    img: string;

    @IsUrl()
    @Expose()
    imgThumb: string;

    @IsArray()
    @Expose()
    users: Array<string>

    @IsInt()
    @Expose()
    notifications: number;
}