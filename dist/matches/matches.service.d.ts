import { Match } from './schemas/match.schema';
import mongoose, { Model } from 'mongoose';
import { GamesService } from 'src/games/games.service';
import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchDto } from './dtos/match.dto';
import { MessagesService } from 'src/messages/messages.service';
export declare class MatchesService {
    private matchModel;
    private readonly gamesService;
    private readonly messagesService;
    constructor(matchModel: Model<Match>, gamesService: GamesService, messagesService: MessagesService);
    create: (createMatchDto: CreateMatchDto, user: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    getMatch: (id: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    getMatchWithGame: (id: string) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    }>;
    getFullMatch: (id: string) => Promise<{
        match: mongoose.Document<unknown, {}, Match> & Match & {
            _id: mongoose.Types.ObjectId;
        };
        messages: (mongoose.Document<unknown, {}, import("../messages/schema/messages.schema").Message> & import("../messages/schema/messages.schema").Message & {
            _id: mongoose.Types.ObjectId;
        })[];
    }>;
    update: (user: string, attrs: Partial<MatchDto>) => Promise<mongoose.Document<unknown, {}, Match> & Match & {
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
    getPlayerInvitations: (user: string, skip?: number) => Promise<(mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    getMatchesByPlatform: (platform: number, skip?: number) => Promise<any[]>;
    getMatchesByGameAndPlatform: (platform: number, game: string, skip?: number) => Promise<(mongoose.Document<unknown, {}, Match> & Match & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    updatePastTimeMatches: () => Promise<Array<Match>>;
}
