import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Match } from './schemas/match.schema';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UserGuard } from 'src/guards/user.guard';
import { MatchesService } from './matches.service';

@Controller('match')
export class MatchesController {
    constructor(private matchesService:MatchesService){}

    @UseGuards(UserGuard)
    @Post('create')
    async create (@Request() req:any, @Body() body:CreateMatchDto) {
        
        console.log(req.user.id);

        return this.matchesService.create(body, req.user.id);
    }


}
