import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import { Model } from 'mongoose';
import { GamesService } from 'src/games/games.service';
import { GameInterface } from './interfaces/game.interface';
import { CreateMatchDto } from './dtos/create-match.dto';
import { MatchDto } from './dtos/match.dto';

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Match.name) private matchModel: Model<Match>,
        private readonly gamesService:GamesService
    ){}

    create = async(createMatchDto:CreateMatchDto, user: string) => {
        const gameData:GameInterface = await this.gamesService.getGame(createMatchDto.game);

        let newMatch:MatchDto = {
            date: createMatchDto.date,
            game: gameData._id,
            inviteds: createMatchDto.inviteds,
            likes: createMatchDto.likes,
            platform: createMatchDto.platform,
            title: createMatchDto.title,
            tournament: false,
            user: user
        }

        const createdMatch = new this.matchModel(newMatch)
        
        const matchDb = await createdMatch.save();

        await this.gamesService.increaseAmountInPlatform(gameData.gameId, createMatchDto.platform)

        return matchDb;
        
    }
    
}
