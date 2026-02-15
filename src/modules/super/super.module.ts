import { Module } from '@nestjs/common';
import { SuperService } from './super.service';
import { SuperController } from './super.controller';
import { UsersModule } from '../users/users.module';
import { MatchesModule } from '../matches/matches.module';
import { FriendshipModule } from '../friendship/friendship.module';
import { MessagesModule } from '../chat/messages/messages.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    UsersModule,
    MatchesModule,
    FriendshipModule,
    MessagesModule,
    NotificationsModule,
  ],
  providers: [SuperService],
  controllers: [SuperController],
})
export class SuperModule {}
