import { IsArray, IsBoolean, IsInt, IsMongoId, IsNumber, IsOptional, IsString, Min } from "class-validator";


export class CreateMatchDto {
    @IsString()
    title: string;

    @IsInt()
    platform: number;

    @IsInt()
    game: number;

    @IsNumber()
    @Min(new Date().getTime())
    date: number;

    @IsArray()
    inviteds: Array<string>

    @IsArray()
    likes: Array<String>

    @IsOptional()
    @IsBoolean()
    private: boolean

}