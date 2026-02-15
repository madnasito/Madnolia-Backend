import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { GamesModule } from 'src/modules/games/games.module';
import { MatchesGateway } from './matches.gateway';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PlatformsModule } from '../platforms/platforms.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }]),
    GamesModule,
    UsersModule,
    NotificationsModule,
    UsersModule,
    PlatformsModule,
    FirebaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '10d' },
        };
      },
    }),
  ],
  providers: [MatchesService, MatchesGateway],
  controllers: [MatchesController],
  exports: [MatchesService],
})
export class MatchesModule {}
