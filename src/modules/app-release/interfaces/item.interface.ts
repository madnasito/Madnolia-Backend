import { ReleaseChangesDto } from "../dtos/release-changes.dto";
import { ReleasePlatform } from "../enums/release-platform.enum";

export interface Item {
    version: string,
    shortVersion: string,
    changes: ReleaseChangesDto[],
    date: string,
    mandatory: boolean,
    url: string,
    platform: ReleasePlatform
}