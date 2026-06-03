import { ReleaseChangesDto } from "../dtos/release-changes.dto";
import { Item } from "./item.interface";

export interface ReleaseResponse {
    appName: string,
    description: string,
    items: Item[]
}