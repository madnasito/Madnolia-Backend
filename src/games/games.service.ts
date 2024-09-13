import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { Model } from 'mongoose';
import { CreateGameDto } from './dtos/create-game.dto';

@Injectable()
export class GamesService {

    constructor(
        @InjectModel(Game.name) private gameModel: Model<Game>,
    ){}

    create = async(createGameDto: CreateGameDto) => {

        const gameDb = await this.findById(createGameDto.gameId);

        if(gameDb) return gameDb;

        const createdGame = new this.gameModel(createGameDto)

        return await createdGame.save();
    }

    findById = async(gameId: number):Promise<any> => await this.gameModel.findOne({gameId})
}
