import { IsArray, IsBoolean, IsDefined, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MatchDto {

    @IsString()
    title: string;

    @IsNotEmpty()
    @IsDefined()
    @IsMongoId()
    user: string

    @IsInt()
    platform: number;

    @IsMongoId()
    game: string;

    @IsNumber()
    date: number;

    @IsArray()
    inviteds: Array<string>

    @IsArray()
    likes: Array<String>

    @IsBoolean()
    tournament: boolean
}