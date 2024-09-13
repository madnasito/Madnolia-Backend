import { Body, Controller, Post } from '@nestjs/common';
import { Match } from './schemas/match.schema';
import { CreateMatchDto } from './dtos/create-match.dto';
import { GamesService } from 'src/games/games.service';

@Controller('match')
export class MatchesController {
    constructor(
        
        private readonly gamesService:GamesService
    ){}

    @Post('create')
    async create (@Body() body:CreateMatchDto) {
        const gameData = await this.gamesService.getGame(body.game)
        console.log(gameData.name);
        return gameData;
    }
}
