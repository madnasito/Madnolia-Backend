import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FriendshipService } from '../friendship/friendship.service';
import { MessagesService } from '../chat/messages/messages.service';
import { MatchesService } from '../matches/matches.service';
import * as mongoose from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Users } from '../users/classes/user';

@Injectable()
export class SuperService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService,
    private readonly messagesService: MessagesService,
    private readonly matchesService: MatchesService,
    private readonly notificationsService: NotificationsService,
    private users: Users,
  ) {}

  async deleteUser(user: mongoose.Types.ObjectId) {
    // To-Do: Desactivate the user and check setting the deletedAt value with a new date
    // Verify with a cronjob if the user is deleted, this is for recover an user by a month
    // If it is not recovered during a month it will be deleted from db and all its documents
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.usersService.delete(user);
      await this.friendshipService.deleteUserFriendships(user);
      await this.notificationsService.deleteUserNotifications(user);
      await this.matchesService.deleteUserFromMatches(user);
      await this.messagesService.deleteAllUserMessages(user);
      await this.messagesService.deleteAllUserMessagesRecipients(user);
      await session.commitTransaction();
    } catch (error) {
      Logger.error(error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
      this.users.deleteUser(user.toString());
      return { ok: true };
    }
  }
}
