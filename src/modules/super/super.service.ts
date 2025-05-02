import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FriendshipService } from '../friendship/friendship.service';
import { MessagesService } from '../chat/messages/messages.service';
import { MatchesService } from '../matches/matches.service';
import mongoose, { Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SuperService {
  constructor(
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService,
    private readonly messagesService: MessagesService,
    private readonly matchesService: MatchesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async deleteUser(user: Types.ObjectId) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await this.usersService.delete(user);
      await this.friendshipService.deleteUserFriendships(user);
      await this.notificationsService.deleteUserNotifications(user);
      await this.matchesService.deleteUserFromMatches(user);
      await this.messagesService.deleteAllUserMessages(user);
      session.commitTransaction();
    } catch (error) {
      Logger.error(error);
      await session.abortTransaction();
    } finally {
      session.endSession();
      return { ok: true };
    }
  }
}
