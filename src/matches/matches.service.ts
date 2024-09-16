import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Match } from './schemas/match.schema';
import mongoose, { Model } from 'mongoose';
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

    getMatch = async(id: string) => {
      if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException()
      return this.matchModel.findById(id)
    }

    update = async(id: string, user: string, attrs: Partial<Match>) => {
        const match = await this.matchModel.findOne({_id: id, user, active: true});

        if(!match) throw new NotFoundException('Match not found')

        Object.assign(match, attrs);

        return match.save();
    }

    delete = async(id: string, user: string) => {

        if(!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundException()

        const matchDeleted = await  this.matchModel.findOneAndUpdate({_id: id, active: true, user}, {active: false}, {new: true})

        if (!matchDeleted) throw new NotFoundException()

        return matchDeleted;
    }

    getPlayerMatches = async(user: string, skip: number = 0) => 
        this.matchModel.find({user}).sort({ _id: -1 }).skip(0)

    getMatchesByPlatform = async (platform: number, skip: number = 0) => {
        
        const results = await this.matchModel.aggregate([
            {
              $match: {
                platform,
                active: true,
              },
            },
            {
              $lookup: {
                from: 'games', // Assuming the collection for games is named 'games'
                localField: 'game',
                foreignField: '_id',
                as: 'gameDetails',
              },
            },
            {
              $unwind: '$gameDetails',
            },
            {
              $group: {
                _id: '$gameDetails._id', // Group by game ID
                count: { $sum: 1 },
                name: { $first: '$gameDetails.name' }, // Or any other field from Game
                background: { $first: '$gameDetails.background' }, // Include background property
                slug: { $first: '$gameDetails.slug' }, // Include slug property
              },
            },
            {
              $sort: {
                count: -1,
              },
            },
          ]);
          return results;
          
    }

    getMatchesByGameAndPlatform = async(platform: number, game: string, skip: number = 0) => 
        this.matchModel.find({platform, game, active: true}).skip(skip)
}
