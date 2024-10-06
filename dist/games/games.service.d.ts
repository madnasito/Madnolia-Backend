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
    findByRawId: (gameId: number) => Promise<any>;
    findById(gameId: string): Promise<any>;
    getRawgGame: (id: number) => Promise<any>;
}
