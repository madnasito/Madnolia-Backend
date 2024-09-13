import { BadGatewayException } from '@nestjs/common';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class GamesService {
    private gameModel;
    private config;
    private readonly httpService;
    constructor(gameModel: Model<Game>, config: ConfigService, httpService: HttpService);
    getGame: (id: number) => Promise<any>;
    increaseAmountInPlatform: (gameId: number, platform: number) => Promise<(import("mongoose").Document<unknown, {}, Game> & Game & {
        _id: import("mongoose").Types.ObjectId;
    }) | BadGatewayException>;
    findByRawId: (gameId: number) => Promise<any>;
    findById: (gameId: string) => Promise<any>;
    getRawgGame: (id: number) => Promise<any>;
}
