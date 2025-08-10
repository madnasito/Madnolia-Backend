import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { GamesModule } from './modules/games/games.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppVersionModule } from './modules/app-version/app-version.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ChatModule } from './modules/chat/chat.module';
import { MailModule } from './modules/mail/mail.module';
import { FriendshipModule } from './modules/friendship/friendship.module';
import { SuperModule } from './modules/super/super.module';
import { PlatformsModule } from './modules/platforms/platforms.module';
import { ReportsModule } from './modules/reports/reports.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('DB_URI'),
          serverSelectionTimeoutMS: 30000, // 30 seconds
          socketTimeoutMS: 45000, // 45 seconds
          retryAttempts: 3, // Retry up to 3 times
          retryDelay: 1000,
          // directConnection: true,
          replicaSet: config.get<string>('MONGODB_REPLICA_SET'),
          readPreference: 'primary',
        };
      },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/browser'),
      exclude: ['/api*'], // Excludes all routes starting with /api
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '10d' },
        };
      },
    }),
    AuthModule,
    MatchesModule,
    TournamentsModule,
    GamesModule,
    NotificationsModule,
    AppVersionModule,
    GroupsModule,
    ChatModule,
    MailModule,
    FriendshipModule,
    SuperModule,
    PlatformsModule,
    ReportsModule,
    // PushNotificationsModule, // Comentado porque ya existe FirebaseModule
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
    // firebaseProvider, // Movido al FirebaseModule
  ],
})
export class AppModule {}
