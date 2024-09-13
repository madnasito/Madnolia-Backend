import { CreateMatchDto } from './dtos/create-match.dto';
import { GamesService } from 'src/games/games.service';
export declare class MatchesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    create(body: CreateMatchDto): Promise<any>;
}
