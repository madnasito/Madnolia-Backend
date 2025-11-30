import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import { Model, Types } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RawgGame } from './interfaces/rawg-game.interface';
import { Platform } from 'src/common/enums/platforms.enum';
import { SearchGamesDto } from './dtos/search-games.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    private config: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getGame = async (id: number) => {
    const gameDb = await this.findByRawId(id);

    if (gameDb) return gameDb;

    const rawGame: RawgGame = await this.getRawgGame(id);

    if (!rawGame) throw new BadGatewayException('LOADING_GAME');

    const validPlatforms = Object.values(Platform).filter(
      (value) => typeof value === 'number',
    );

    const newGame = {
      name: rawGame.name,
      slug: rawGame.slug,
      gameId: rawGame.id,
      platforms: rawGame.platforms
        .map((e) => e.platform.id)
        .filter((p) => validPlatforms.includes(p)),
      background: rawGame.background_image,
      screenshots: [],
      description: rawGame.description_raw,
    };

    const createdGame = new this.gameModel(newGame);

    return await createdGame.save();
  };

  findByRawId = async (gameId: number): Promise<any> =>
    await this.gameModel.findOne({ gameId });

  findBySlug = async (slug: string): Promise<Game> =>
    await this.gameModel.findOne({ slug });

  async findById(gameId: string): Promise<any> {
    const gameDb = await this.gameModel.findById(gameId);

    if (!gameDb) throw new NotFoundException();

    return gameDb;
  }

  getRawgGame = async (id: number) => {
    try {
      const apiKey = this.config.get<string>('RAWG_API_KEY');

      const gameData = (
        await this.httpService.axiosRef.get(`/${id}?key=${apiKey}`)
      ).data;
      return gameData;
    } catch (error) {
      Logger.error(error);
      Logger.error('Error loading game for rawg');
    }
  };

  getGamesInfo = async (games: Types.ObjectId[]) =>
    this.gameModel.find({ _id: { $in: games } });

  searchGames = async (payload: SearchGamesDto) => {
    try {
      const apiKey = this.config.get<string>('RAWG_API_KEY');

      payload.key = apiKey;

      const gamesData: RawgGame[] = (
        await this.httpService.axiosRef.get('', {
          params: payload,
        })
      ).data.results;

      if (!gamesData) throw new BadGatewayException('LOADING_GAME');

      const validPlatforms = Object.values(Platform).filter(
        (value) => typeof value === 'number',
      );

      const games: Array<any> = gamesData.map((rawGame) => {
        const gameData = {
          name: rawGame.name,
          slug: rawGame.slug,
          gameId: rawGame.id,
          platforms: rawGame.platforms
            .map((e) => e.platform.id)
            .filter((p) => validPlatforms.includes(p)),
          background: rawGame.background_image,
          screenshots: [],
          description: rawGame.description_raw,
        };
        return gameData;
      });

      return games;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  };
}
