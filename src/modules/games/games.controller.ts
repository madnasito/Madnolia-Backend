import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { MultipleMongoIdsDto } from 'src/common/dto/mutiple-mongo-ids.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get(':game')
  getGame(@Param('game') game: string) {
    return this.gamesService.findBySlug(game);
  }

  @Get('/id/:game')
  getGameById(@Param('game') game: string) {
    return this.gamesService.findById(game);
  }

  @Post('get-by-ids')
  getGamesByIds(@Body() body: MultipleMongoIdsDto) {
    return this.gamesService.getGamesInfo(body.ids);
  }
}
