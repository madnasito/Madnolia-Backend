import { Match } from './schemas/match.schema';
import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/update-match.dto';
export declare class MatchesController {
    private matchesService;
    constructor(matchesService: MatchesService);
    getMatch(id: string): Promise<import("mongoose").Document<unknown, {}, Match> & Match & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    getPlayerMatches(request: any): Promise<(import("mongoose").Document<unknown, {}, Match> & Match & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    getMatchesByPlatform(platform: string): Promise<any[]>;
    create(req: any, body: CreateMatchDto): Promise<import("mongoose").Document<unknown, {}, Match> & Match & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    update(req: any, body: UpdateMatchDto): Promise<import("mongoose").Document<unknown, {}, Match> & Match & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    delete(req: any, id: string): Promise<import("mongoose").Document<unknown, {}, Match> & Match & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
}
