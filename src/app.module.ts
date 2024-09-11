import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/madnolia'),
    UserModule,
    AuthModule,
    MatchModule,
    TournamentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
