import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/update-match.dto';
export declare class MatchesController {
    private matchesService;
    constructor(matchesService: MatchesService);
    getMatch(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMatchWithGame(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getFullMatch(id: string): Promise<{
        match: import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
            _id: import("mongoose").Types.ObjectId;
        };
        messages: (import("mongoose").Document<unknown, {}, import("../messages/schema/messages.schema").Message> & import("../messages/schema/messages.schema").Message & {
            _id: import("mongoose").Types.ObjectId;
        })[];
    }>;
    getPlayerMatches(request: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getPlayerInvitations(request: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getLatestUserGames(request: any, platform: string): Promise<any>;
    getMatchesByPlatform(platform: string): Promise<any[]>;
    getMatchesByGameAndPlatform(platform: string, game: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(req: any, body: CreateMatchDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(req: any, body: UpdateMatchDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/match.schema").Match> & import("./schemas/match.schema").Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
