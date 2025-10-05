import { UseGuards, Request, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { Namespace, Socket } from 'socket.io';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dtos/create-notification.dto';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { Users } from './classes/user';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from '../friendship/friendship.service';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(UsersGateway.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequestService: ConnectionRequestService,
    private readonly jwtService: JwtService,
    private readonly friendshipService: FriendshipService,
    private readonly notificationsService: NotificationsService,
    private users: Users,
  ) {}

  @WebSocketServer() io: Namespace;

  handleDisconnect(client: any) {
    this.users.deleteUserSocketId(client.id);
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { size } = this.io.sockets;

      console.table(client.handshake.auth);
      let { token } = client.handshake.auth;

      const { fcm_token } = client.handshake.headers;

      if (!token) token = client.handshake.headers['token'];

      if (token === undefined || token === null || token === '') {
        client.disconnect(true);
        throw new WsException('MISSING_TOKEN');
      }

      const tokenPayload = await this.jwtService.verifyAsync(token as string);
      await this.users.addUser(tokenPayload.id, client.id, fcm_token as string);

      const friendshipsIds = (
        await this.friendshipService.findFriendshipsByUser(tokenPayload.id)
      ).map((e) => e.id);

      friendshipsIds.forEach((element) => client.join(element));

      this.logger.debug(`Client id: ${client.id} connected`);
      this.logger.debug(`Number of connected clients: ${size}`);
    } catch (error) {
      return new WsException(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('request_connection')
  async requestNewConnection(
    @MessageBody() requestedUser: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    const requested = await this.usersService.findOneById(requestedUser);
    const { name, thumb, id } = await this.usersService.findOneById(
      request.user,
    );
    if (!requested) throw new WsException('USER_NOT_FOUND');
    const requestDb = await this.connectionRequestService.create(
      request.user,
      requested.id,
    );

    const newNotification: CreateNotificationDto = {
      user: requested.id,
      type: NotificationType.REQUEST,
      title: name,
      thumb,
      sender: request.user,
      path: id,
    };

    await this.notificationsService.create(newNotification);
    client.emit('new_request_connection', requestDb);

    const requestedUserSockets = this.users.getUserSocketsById(requestedUser);

    requestedUserSockets.forEach((socketId) => {
      client.to(socketId).emit('new_request_connection', requestDb);
    });

    return requestDb;
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('accept_connection')
  async acceptConnection(
    @MessageBody() sender: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.acceptConnection(
          sender,
          request.user,
        );

      await this.notificationsService.deleteRequestConnection(
        connectionRequestDb.receiver,
        connectionRequestDb.sender,
      );

      client.emit('connection_accepted', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('reject_connection')
  async rejectConnection(
    @MessageBody() sender: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.rejectConnection(
          sender,
          request.user,
        );

      await this.notificationsService.deleteRequestConnection(
        sender,
        request.user,
      );
      client.emit('connection_rejected', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('cancel_connection')
  async cancelConnection(
    @MessageBody() requestedId: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.cancelConnection(
          request.user,
          requestedId,
        );

      await this.notificationsService.deleteRequestConnection(
        request.user,
        requestedId,
      );

      client.emit('canceled_connection', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('remove_partner')
  async removePartner(
    @MessageBody() userId: Types.ObjectId,
    @Request() request: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await this.usersService.removePartner(request.user, userId);
      client.emit('removed_partner', userId);
    } catch (error) {
      Logger.error(error);
      throw new WsException('ERROR_REMOVING_PARTNER');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('logout_device')
  async logoutDevice(@ConnectedSocket() client: Socket) {
    this.users.logoutDevice(client.id);
  }
}
