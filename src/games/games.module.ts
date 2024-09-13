import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { GamesService } from './games.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
        HttpModule.register({
            baseURL: 'https://api.rawg.io/api/games'
        })
    ],
    providers: [GamesService],
    exports: [GamesService]
    
})
export class GamesModule {}
