import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GamesModule } from 'src/games/games.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
        GamesModule
    ],
    providers: [MatchesService],
    controllers: [MatchesController]
})
export class MatchesModule {}
