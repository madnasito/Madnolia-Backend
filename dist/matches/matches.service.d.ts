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
    getMatch: (id: string) => Promise<import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update: (id: string, user: string, attrs: Partial<Match>) => Promise<import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete: (id: string, user: string) => Promise<import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getPlayerMatches: (user: string, skip?: number) => Promise<(import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getMatchesByPlatform: (platform: number, skip?: number) => Promise<any[]>;
    getMatchesByGameAndPlatform: (platform: number, game: string, skip?: number) => Promise<(import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
