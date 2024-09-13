import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { GamesModule } from './games/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DB_URI')
        }
      }
    }),
    // MongooseModule.forRoot('mongodb://localhost/madnolia'),
    UserModule,
    AuthModule,
    MatchesModule,
    TournamentsModule,
    GamesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
