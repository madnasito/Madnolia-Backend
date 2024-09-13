import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { CreateGameDto } from './dtos/create-game.dto';
export declare class GamesService {
    private gameModel;
    constructor(gameModel: Model<Game>);
    create: (createGameDto: CreateGameDto) => Promise<any>;
    findById: (gameId: number) => Promise<any>;
}
