import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])],
    providers: [MatchesService],
    controllers: [MatchesController]
})
export class MatchesModule {}
