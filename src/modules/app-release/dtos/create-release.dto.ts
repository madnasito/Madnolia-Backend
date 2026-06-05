import { plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsNumber, IsString, ValidateNested } from "class-validator";
import { ReleasePlatform } from "../enums/release-platform.enum";
import { ReleaseChangesDto } from "./release-changes.dto";

export class CreateReleaseDto {
    @IsString()
    version: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    codeVersion: number;

    @IsEnum(ReleasePlatform)
    platform: ReleasePlatform;

    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    mandatory: boolean;

    @Transform(({ value }) => {
        let parsed: any[];
        if (typeof value === 'string') {
            try { parsed = JSON.parse(value); } catch { return value; }
        } else {
            parsed = Array.isArray(value) ? value : [value];
        }
        return parsed.map(item => plainToInstance(ReleaseChangesDto, item));
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReleaseChangesDto)
    changes: ReleaseChangesDto[];
}