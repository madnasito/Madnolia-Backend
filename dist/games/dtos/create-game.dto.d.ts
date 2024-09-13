export declare class CreateGameDto {
    gameId: number;
    name: string;
    platforms: gamePlatform[];
    background: string;
    screenshots: Array<string>;
    description: string;
}
interface gamePlatform {
    id: number;
    amount: number;
}
export {};
