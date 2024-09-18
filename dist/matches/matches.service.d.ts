import { Match } from './schemas/match.schema';
import mongoose, { Model } from 'mongoose';
import { GamesService } from 'src/games/games.service';
import { CreateMatchDto } from './dtos/create-match.dto';
export declare class MatchesService {
    private matchModel;
    private readonly gamesService;
    constructor(matchModel: Model<Match>, gamesService: GamesService);
    create: (createMatchDto: CreateMatchDto, user: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    getMatch: (id: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    update: (id: string, user: string, attrs: Partial<Match>) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    delete: (id: string, user: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    addUserToMatch: (id: string, user: string) => mongoose.Query<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }, mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }, {}, Match, "findOneAndUpdate", {}>;
    getPlayerMatches: (user: string, skip?: number) => Promise<(mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    getMatchesByPlatform: (platform: number, skip?: number) => Promise<any[]>;
    getMatchesByGameAndPlatform: (platform: number, game: string, skip?: number) => Promise<(mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    })[]>;
}
