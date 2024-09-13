import { Match } from './schemas/match.schema';
import { Model } from 'mongoose';
import { GamesService } from 'src/games/games.service';
import { CreateMatchDto } from './dtos/create-match.dto';
export declare class MatchesService {
    private matchModel;
    private readonly gamesService;
    constructor(matchModel: Model<Match>, gamesService: GamesService);
    create: (createMatchDto: CreateMatchDto, user: string) => Promise<import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
