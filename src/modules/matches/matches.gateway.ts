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

@WebSocketGateway()
export class MatchesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MatchesGateway.name);

  constructor(
    private matchesService: MatchesService,
    private users: Users,
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

    match.inviteds.forEach((element) => {
      const socketsIds = this.users.getUserSocketsById(element);
      if (socketsIds.length > 0) {
        socketsIds.forEach((socketId) => {
          client.to(socketId).emit('invitation', eventPayload);
        });
      }
    });

    // client.emit('invitation', eventPayload)
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('join_to_match')
  async handleJoinToMatch(client: Socket, payload: string) {
    try {
      this.logger.debug(`Client id: ${client.id} tries to join`);

      const user = this.users.getUserBySocketId(client.id);
      this.logger.debug(user);
      const matchUpdated = await this.matchesService.addUserToMatch(
        payload,
        user._id.toString(),
      );

      this.logger.debug(matchUpdated);

      if (!matchUpdated) {
        client.emit('added_to_match', false);
        throw new WsException(new NotFoundException('NO_MATCH_FOUND'));
      }

      client.emit('added_to_match', true);

      const { _id, name, thumb, username } = user;

      client.to(payload).emit('new_player_to_match', {
        _id,
        name,
        thumb,
        username,
      });
      this.logger.debug(`Client id: ${client.id} joined to match`);
    } catch (error) {
      client.emit('added_to_match', false);
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

        let users = this.users.getUsersSockets(match.joined);
        this.logger.debug(`Joined users sockets found: ${users.length}`);

        users = users.concat(hoster);

        Logger.debug(hoster);
        Logger.debug(users);

        users.forEach((socketId) =>
          this.io.to(socketId).emit('match_ready', payload),
        );

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
