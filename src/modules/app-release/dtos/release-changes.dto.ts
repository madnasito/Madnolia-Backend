import { IsEnum, IsString } from "class-validator";
import { ReleaseChangeType } from "../enums/release-change-type.enum";

export class ReleaseChangesDto {
    @IsEnum(ReleaseChangeType)
    type: ReleaseChangeType;

    @IsString()
    message: string;
}