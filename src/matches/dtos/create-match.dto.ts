import { IsArray, IsBoolean, IsInt, IsMongoId, IsNumber, IsString } from "class-validator";


export class CreateMatchDto {
    @IsString()
    title: string;

    @IsInt()
    platform: number;

    @IsInt()
    game: number;

    @IsNumber()
    date: number;

    @IsArray()
    inviteds: Array<string>

    @IsArray()
    likes: Array<String>


}