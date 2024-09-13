import { Match } from './schemas/match.schema';
import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchesService } from './matches.service';
export declare class MatchesController {
    private matchesService;
    constructor(matchesService: MatchesService);
    create(req: any, body: CreateMatchDto): Promise<import("mongoose").Document<unknown, {}, Match> & Match & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
