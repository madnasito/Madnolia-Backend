import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsMongoId, IsOptional, IsString, IsUrl } from "class-validator";

export class UserDto {

    @IsMongoId()
    @IsOptional()
    @Expose()
    _id: string;

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
    partners: Array<string>

    @IsInt()
    @Expose()
    invitationsStatus: number

    @IsInt()
    @Expose()
    notifications: number;
}