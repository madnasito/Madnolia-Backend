import { Match } from './schemas/match.schema';
import { Model } from 'mongoose';
export declare class MatchesService {
    private matchModel;
    constructor(matchModel: Model<Match>);
}
