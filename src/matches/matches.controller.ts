import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { Match } from './schemas/match.schema';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UserGuard } from 'src/guards/user.guard';
import { MatchesService } from './matches.service';
import { UpdateMatchDto } from './dtos/update-match.dto';

@Controller('match')
export class MatchesController {
    constructor(private matchesService:MatchesService){}

    @Get('info/:id')
    async getMatch(@Param('id') id: string){
        return this.matchesService.getMatch(id);
    }

    @UseGuards(UserGuard)
    @Get('player-matches')
    async getPlayerMatches(@Request() request:any){
        return this.matchesService.getPlayerMatches(request.user.id)
    }

    @Get('platform/:platform')
    async getMatchesByPlatform(@Param('platform') platform: string){
        return this.matchesService.getMatchesByPlatform(parseInt(platform))
    }

    @UseGuards(UserGuard)
    @Post('create')
    async create (@Request() req:any, @Body() body:CreateMatchDto) {
        return this.matchesService.create(body, req.user.id);
    }

    @UseGuards(UserGuard)
    @Put('update')
    update(@Request() req:any, @Body() body: UpdateMatchDto) {
        return this.matchesService.update(req.user.id, body);
    }

    @UseGuards(UserGuard)
    @Delete('delete/:id')
    delete(@Request() req:any, @Param('id') id: string){
        return this.matchesService.delete(id, req.user.id)
    }

}
