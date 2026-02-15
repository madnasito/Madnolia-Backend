import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { MatchesService } from './matches.service';
import { Users } from 'src/modules/users/classes/user';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchDto } from './dtos/match.dto';
import { SendNotificationDto } from '../firebase/dtos/send-notification.dto';
import { FirebaseCloudMessagingService } from '../firebase/firebase-cloud-messaging/firebase-cloud-messaging.service';
import { Types } from 'mongoose';
import { NewPlayerToMatch } from './interfaces/player-to-match.interface';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway()
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MatchesGateway.name);

  constructor(
    private matchesService: MatchesService,
    private jwtService: JwtService,
    private users: Users,
    private firebaseCloudMessagingService: FirebaseCloudMessagingService,
  ) {}

  @WebSocketServer() io: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: any) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: any, ...args: any[]) {
    try {
      let { token } = client.handshake.auth;

      if (!token) token = client.handshake.headers['token'];

      if (token === undefined || token === null || token === '') {
        this.logger.error(
          `Connection denied: Missing token for client ${client.id}`,
        );
        client.disconnect(true);
        return;
      }

      const tokenPayload = await this.jwtService.verifyAsync(token as string);

      const userMatchesIds: string[] = (
        await this.matchesService.getActiveMatchesJoinedOrCreatedByUser(
          tokenPayload.id,
        )
      ).map((match) => match.id);

      userMatchesIds.forEach((id) => client.join(id));
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id}: ${error.stack || error.message}`,
      );
      client.disconnect(true);
    }
  }

  @UseGuards(UserSocketGuard)
  // @SubscribeMessage('match_created')
  async handleMatchCreated(user: Types.ObjectId, payload: string) {
    const userSocketIds = this.users.getUserSocketsById(user);

    userSocketIds.forEach((socketId) => {
      const client = this.io.sockets.sockets.get(socketId);

      if (client) {
        this.logger.debug(
          `Client id: ${client.id} has created a match and tries to join`,
        );
        client.join(payload.toString());
        this.logger.debug(`Client id: ${client.id} joined to match`);
      }
    });

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
  async handleJoinToMatch(user: Types.ObjectId, payload: Types.ObjectId) {
    try {
      const userSocketIds = this.users.getUserSocketsById(user);

      userSocketIds.forEach((socketId) => {
        const client = this.io.sockets.sockets.get(socketId);

        if (client) {
          this.logger.debug(`Client id: ${client.id} tries to join`);
          client.join(payload.toString());
          this.logger.debug(`Client id: ${client.id} joined to match`);
        }
      });

      const newPlayerToMatchPayload: NewPlayerToMatch = {
        match: payload,
        user,
      };
      this.io
        .to(payload.toString())
        .emit('new_player_to_match', newPlayerToMatchPayload);
    } catch (error) {
      throw new WsException(error);
    }
  }

  handleMatchCancelled(match: string) {
    this.io.to(match).emit('match_cancelled', match);
  }

  @UseGuards(UserSocketGuard)
  async handleLeaveMatch(user: Types.ObjectId, payload: Types.ObjectId) {
    try {
      await this.matchesService.leaveMatch(payload, user);

      const userSocketIds = this.users.getUserSocketsById(user);

      userSocketIds.forEach((socketId) => {
        const client = this.io.sockets.sockets.get(socketId);

        if (client) {
          this.logger.debug(`Client id: ${client.id} tries to leave`);
          client.leave(payload.toString());
          this.logger.debug(`Client id: ${client.id} leaved the match`);
        }
      });

      this.io.to(payload.toString()).emit('player_left_match', user);
    } catch (error) {
      throw new WsException(error);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      this.logger.log('🚀 CRON JOB INICIADO');
      this.logger.log(`Timestamp: ${new Date().toISOString()}`);
      const matches: any = await this.matchesService.updatePastTimeMatches();

      matches.forEach((match: MatchDto) => {
        const payload = {
          title: match.title,
          match: match._id,
        };

        // Event to hoster
        this.logger.log(`Looking for hoster with ID: ${match.user}`);
        this.logger.log(
          `Connected users: ${this.users
            .getUsers()
            .map((u) => u._id)
            .join(', ')}`,
        );

        const hoster = this.users.getUserSocketsById(match.user);
        this.logger.log(`Hoster sockets found: ${hoster.length}`);

        let usersSockets: string[] = this.users.getUsersSockets(match.joined);
        this.logger.debug(`Joined users sockets found: ${usersSockets.length}`);

        usersSockets = usersSockets.concat(hoster);

        this.logger.log(hoster);
        this.logger.log(usersSockets);

        usersSockets.forEach((socketId) =>
          this.io.to(socketId).emit('match_ready', payload),
        );

        const userIds = match.joined;

        userIds.push(match.user);

        const fcmTokens =
          this.users.getUsersFcmTokensWithoutSocketById(userIds);

        this.logger.log(fcmTokens);

        try {
          if (fcmTokens.length > 0) {
            this.logger.log('Push notification of match ready');

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
      this.logger.error(error);
      throw new WsException(error);
    }
  }
}
