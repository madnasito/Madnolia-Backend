import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UserGuard } from 'src/common/guards/user.guard';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/update-match.dto';
import { PlatformParent } from '../platforms/enums/platform-parent.enum';
import { Types } from 'mongoose';
import { PlayerMatchesFiltersDto } from './dtos/player-matches-filters.dto';

@Controller('match')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get('info/:id')
  async getMatch(@Param('id') id: Types.ObjectId) {
    return this.matchesService.getMatch(id);
  }

  @Get('get-by')
  async getByPlatformDaddy(
    @Query('parent') parent: PlatformParent,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
  ) {
    return this.matchesService.getMatchesByPlatformParent(
      parent,
      parseInt(skip),
      parseInt(limit),
    );
  }

  @Get('with-game/:id')
  async getMatchWithGame(@Param('id') id: string) {
    return this.matchesService.getMatchWithGame(id);
  }

  @Get('full/:id')
  async getFullMatch(@Param('id') id: string) {
    return this.matchesService.getFullMatch(id);
  }

  @UseGuards(UserGuard)
  @Get('player-matches')
  async getPlayerMatches(
    @Request() request: any,
    @Body() body: PlayerMatchesFiltersDto,
  ) {
    return this.matchesService.getPlayerMatches(request.user.id, body);
  }

  @UseGuards(UserGuard)
  @Get('invitations')
  async getPlayerInvitations(@Request() request: any) {
    return this.matchesService.getPlayerInvitations(request.user.id);
  }

  @UseGuards(UserGuard)
  @Get('latest-games/:platform')
  async getLatestUserGames(
    @Request() request: any,
    @Param('platform') platform: string,
  ) {
    return this.matchesService.getLatestGamesByUserAndPlatform(
      request.user.id,
      parseInt(platform),
    );
  }

  @UseGuards(UserGuard)
  @Get('joined')
  joined(@Request() request: any) {
    return this.matchesService.getMatchesWithUserJoined(request.user.id);
  }
  @Get('platform')
  async getMatchesByPlatform(
    @Query('platform') platform: string,
    @Query('skip') skip: string,
    @Query('limit') limit: string,
  ) {
    return this.matchesService.getMatchesByPlatform(
      parseInt(platform),
      parseInt(skip),
      parseInt(limit),
    );
  }

  @Get('by-platform-and-game/:platform/:game')
  async getMatchesByGameAndPlatform(
    @Param('platform') platform: string,
    @Param('game') game: string,
  ) {
    return this.matchesService.getMatchesByGameAndPlatform(
      parseInt(platform),
      game,
    );
  }

  @Get('by-platform-and-game-slug/:platform/:game')
  async getMatchesByGameSlugAndPlatform(
    @Param('platform') platform: string,
    @Param('game') game: string,
  ) {
    return this.matchesService.getMatchesByGameSlugAndPlatform(
      parseInt(platform),
      game,
    );
  }

  @UseGuards(UserGuard)
  @Post('create')
  async create(@Request() req: any, @Body() body: CreateMatchDto) {
    return this.matchesService.create(body, req.user.id);
  }

  @UseGuards(UserGuard)
  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: UpdateMatchDto,
  ) {
    return this.matchesService.update(id, req.user.id, body);
  }

  @UseGuards(UserGuard)
  @Delete('delete/:id')
  delete(@Request() req: any, @Param('id') id: string) {
    return this.matchesService.delete(id, req.user.id);
  }
}
