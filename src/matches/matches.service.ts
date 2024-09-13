import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import { Model } from 'mongoose';

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Match.name) private matchModel: Model<Match>
    ){}

    
}
