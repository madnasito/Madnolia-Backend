import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { MatchesService } from './matches.service';
import { Users } from 'src/modules/users/classes/user';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchDto } from './dtos/match.dto';
import { SendNotificationDto } from '../firebase/dtos/send-notification.dto';
import { FirebaseCloudMessagingService } from '../firebase/firebase-cloud-messaging/firebase-cloud-messaging.service';
import { Types } from 'mongoose';
import { NewPlayerToMatch } from './interfaces/player-to-match.interface';

@WebSocketGateway()
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MatchesGateway.name);

  constructor(
    private matchesService: MatchesService,
    private users: Users,
    private firebaseCloudMessagingService: FirebaseCloudMessagingService,
  ) {}

  @WebSocketServer() io: Namespace;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: any, ...args: any[]) {}

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('match_created')
  async handleMatchCreated(client: Socket, payload: string) {
    this.logger.debug(client);
    this.logger.debug(payload);

    const match = await this.matchesService.getMatchWithGame(payload);

    this.logger.debug(match);

    if (!match) throw new WsException('NO_MATCH_FOUND');

    const matchUrl = `${process.env.URL}/match/info/${match._id}`;

    const eventPayload = {
      match: match._id,
      img: match.game.background,
      name: match.title,
      url: matchUrl,
      user: match.user,
    };

    const usersSockets = this.users.getUsersSockets(match.inviteds);

    usersSockets.forEach((socketId) =>
      this.io.to(socketId).emit('invitation', eventPayload),
    );

    const fcmTokens = this.users.getUsersFcmTokensWithoutSocketById(
      match.inviteds,
    );

    if (fcmTokens.length > 0) {
      const notificationPayload: SendNotificationDto = {
        body: match.description,
        title: 'Invitation',
        data: {
          type: 'invitation',
          data: JSON.stringify(eventPayload),
        },
        tokens: fcmTokens,
      };
      this.firebaseCloudMessagingService.sendToMultipleTokens(
        notificationPayload,
      );
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('join_to_match')
  async handleJoinToMatch(client: Socket, payload: Types.ObjectId) {
    try {
      this.logger.debug(`Client id: ${client.id} tries to join`);

      const user = this.users.getUserBySocketId(client.id);
      this.logger.debug(user);
      const matchUpdated = await this.matchesService.addUserToMatch(
        payload,
        user._id,
      );

      this.logger.debug(matchUpdated);

      if (!matchUpdated) {
        client.emit('added_to_match', false);
        throw new WsException(new NotFoundException('NO_MATCH_FOUND'));
      }

      client.emit('added_to_match', true);

      const { _id } = user;

      const newPlayerToMatchPayload: NewPlayerToMatch = {
        match: payload,
        user: _id,
      };
      client
        .to(payload.toString())
        .emit('new_player_to_match', newPlayerToMatchPayload);
      this.logger.debug(`Client id: ${client.id} joined to match`);
    } catch (error) {
      client.emit('added_to_match', false);
      throw new WsException(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('leave_match')
  async handleLeaveMatch(client: Socket, payload: Types.ObjectId) {
    try {
      this.logger.debug(
        `Client id: ${client.id} tries to leave the match ${payload}`,
      );

      const user = this.users.getUserBySocketId(client.id);

      await this.matchesService.leaveMatch(payload, user._id);

      client.emit('left_match', true);

      client.to(payload.toString()).emit('player_left_match', user._id);
    } catch (error) {
      client.emit('left_match', false);
      throw new WsException(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      // this.logger.debug('Called every minute');
      const matches: any = await this.matchesService.updatePastTimeMatches();

      matches.forEach((match: MatchDto) => {
        const payload = {
          title: match.title,
          match: match._id,
        };

        // Event to hoster
        this.logger.debug(`Looking for hoster with ID: ${match.user}`);
        this.logger.debug(
          `Connected users: ${this.users
            .getUsers()
            .map((u) => u._id)
            .join(', ')}`,
        );

        const hoster = this.users.getUserSocketsById(match.user);
        this.logger.debug(`Hoster sockets found: ${hoster.length}`);

        let usersSockets: string[] = this.users.getUsersSockets(match.joined);
        this.logger.debug(`Joined users sockets found: ${usersSockets.length}`);

        usersSockets = usersSockets.concat(hoster);

        Logger.debug(hoster);
        Logger.debug(usersSockets);

        usersSockets.forEach((socketId) =>
          this.io.to(socketId).emit('match_ready', payload),
        );

        const userIds = match.joined;

        userIds.push(match.user);

        const fcmTokens =
          this.users.getUsersFcmTokensWithoutSocketById(userIds);

        Logger.debug(fcmTokens);

        try {
          if (fcmTokens.length > 0) {
            this.logger.debug('Push notification of match ready');

            const notificationPayload: SendNotificationDto = {
              title: match.title,
              body: match.description,
              data: {
                type: 'match_ready',
                data: JSON.stringify(payload),
              },
              tokens: fcmTokens,
            };
            this.firebaseCloudMessagingService.sendToMultipleTokens(
              notificationPayload,
            );
          }
        } catch (error) {
          this.logger.error(error);
        }

        // this.io.to(match._id.toString()).emit('match_ready', payload);

        // const socketsIds = this.users.getUsersSockets(match.joined);

        // if (hoster && hoster.socketsIds.length > 0)
        //   hoster.socketsIds.forEach((socketId) =>
        //     this.io.to(socketId).emit('match_ready', payload),
        //   );

        // Event to joined users
        // match.joined.forEach((user) => {
        //   const socketUser = this.users.getUserById(user);
        //   if (socketUser && socketUser.socketsIds.length > 0) {
        //     socketUser.socketsIds.forEach((socketId) =>
        //       this.io.to(socketId).emit('match_ready', payload),
        //     );
        //     this.logger.debug(`Notification to ${socketUser.username}`);
        //   }
        // });
      });
    } catch (error) {
      this.logger.debug(error);
      throw new WsException(error);
    }
  }
}
