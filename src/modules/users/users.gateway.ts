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
import { Server, Socket } from 'socket.io';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dtos/create-notification.dto';
import { NotificationType } from '../notifications/enums/notification-type.enum';
import { Users } from './classes/user';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from '../friendship/friendship.service';
import { Availability } from './enums/availability.enum';
import { SendNotificationDto } from '../firebase/dtos/send-notification.dto';
import { FirebaseCloudMessagingService } from '../firebase/firebase-cloud-messaging/firebase-cloud-messaging.service';
import { ConnectionRequestStatus } from './connection-request/enums/connection-status.enum';

@WebSocketGateway()
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(UsersGateway.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequestService: ConnectionRequestService,
    private readonly jwtService: JwtService,
    private readonly friendshipService: FriendshipService,
    private readonly notificationsService: NotificationsService,
    private firebaseCloudMessagingService: FirebaseCloudMessagingService,
    private users: Users,
  ) {}

  @WebSocketServer() io: Server;

  async handleDisconnect(client: any) {
    try {
      const user = this.users.getUserBySocketId(client.id);

      if (user) {
        await this.usersService.handleUserDisconnection(user._id, client.id);
      }
    } catch (error) {
      console.error(error);
      throw new WsException('ERROR_HANDLING_DISCONNECTION');
    }

    this.users.deleteUserSocketId(client.id);
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { size } = this.io.sockets.sockets;

      console.table(client.handshake.auth);
      let { token } = client.handshake.auth;

      const { fcm_token } = client.handshake.headers;

      if (!token) token = client.handshake.headers['token'];

      if (token === undefined || token === null || token === '') {
        this.logger.error(
          `Connection denied: Missing token for client ${client.id}`,
        );
        client.disconnect(true);
        return;
      }

      const tokenPayload = await this.jwtService.verifyAsync(token as string);
      await this.usersService.handleUserConnection(
        tokenPayload.id,
        fcm_token as string,
      );
      await this.users.addUser(tokenPayload.id, client.id, fcm_token as string);

      const friendshipsIds = (
        await this.friendshipService.findFriendshipsByUser(tokenPayload.id)
      ).map((e) => e.id);

      friendshipsIds.forEach((element) => client.join(element));

      this.logger.debug(`Client id: ${client.id} connected`);
      this.logger.debug(`Number of connected clients: ${size}`);
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id}: ${error.stack || error.message}`,
      );
      client.disconnect(true);
      return;
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('update_availability')
  async updateAvailability(
    @MessageBody() availability: Availability,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      this.logger.debug('Updating availability...' + availability);
      await this.usersService.updateAvailability(request.user, availability);

      client.emit('update_availability', availability);

      const userSockets = this.users.getUserSocketsById(request.user);

      userSockets.forEach((socketId) => {
        if (socketId !== client.id) {
          client.to(socketId).emit('update_availability', availability);
        }
      });

      return availability;
    } catch (error) {
      this.logger.error(error);
      throw new WsException('ERROR_UPDATING_AVAILABILITY');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('request_connection')
  async requestNewConnection(
    @MessageBody() requestedUser: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    if (requestedUser.toString() === request.user.toString()) {
      throw new WsException('CANNOT_REQUEST_YOURSELF');
    }
    const requested = await this.usersService.findOneById(requestedUser);
    const { name, thumb, id } = await this.usersService.findOneById(
      request.user,
    );
    if (!requested) throw new WsException('USER_NOT_FOUND');

    const alreadyRequested =
      await this.connectionRequestService.findOneByUserIds(
        request.user,
        requested._id,
      );

    if (
      alreadyRequested != null &&
      alreadyRequested.status != ConnectionRequestStatus.REJECTED
    )
      throw new WsException('ALREADY_REQUESTED');

    const requestDb = await this.connectionRequestService.create(
      request.user,
      requested._id,
    );

    const newNotification: CreateNotificationDto = {
      user: requested._id,
      type: NotificationType.REQUEST,
      title: name,
      thumb,
      sender: request.user,
      path: id,
    };

    const notificationDb =
      await this.notificationsService.create(newNotification);
    client.emit('new_request_connection', requestDb);

    const requestedUserSockets = this.users.getUserSocketsById(requestedUser);

    requestedUserSockets.forEach((socketId) => {
      client.to(socketId).emit('new_request_connection', requestDb);
      client.to(socketId).emit('standard_notification', notificationDb);
    });

    try {
      const fcmTokens = this.users.getUserFcmTokensNoSocketById(requestedUser);

      if (fcmTokens.length > 0) {
        const notificationPayload: SendNotificationDto = {
          tokens: fcmTokens,
          title: name,
          body: '',
          imageUrl: thumb,
          data: {
            type: 'new_request_connection',
            data: JSON.stringify(requestDb),
          },
        };
        await this.firebaseCloudMessagingService.sendToMultipleTokens(
          notificationPayload,
        );
      }
    } catch (error) {
      this.logger.error(error);
    }

    return requestDb;
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('accept_request')
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
        connectionRequestDb.request.receiver,
        connectionRequestDb.request.sender,
      );

      client.emit('request_accepted', connectionRequestDb);

      const senderUserSockets = this.users.getUserSocketsById(sender);

      senderUserSockets.forEach(async (socketId) => {
        client.to(socketId).emit('request_accepted', connectionRequestDb);
        const targetSocket = this.io.sockets.sockets.get(socketId);
        if (targetSocket) {
          await targetSocket.join(connectionRequestDb.request._id.toString());
        }
      });

      const { name, thumb } = await this.usersService.findOneById(request.user);

      try {
        const fcmTokens = this.users.getUserFcmTokensNoSocketById(sender);

        if (fcmTokens.length > 0) {
          const notificationPayload: SendNotificationDto = {
            tokens: fcmTokens,
            title: name,
            body: '',
            imageUrl: thumb,
            data: {
              type: 'request_accepted',
              data: JSON.stringify(connectionRequestDb),
            },
          };
          await this.firebaseCloudMessagingService.sendToMultipleTokens(
            notificationPayload,
          );
        }
      } catch (error) {
        this.logger.error(error);
      }

      await client.join(connectionRequestDb.request._id.toString());
      // return connectionRequestDb;
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
  logoutDevice(@ConnectedSocket() client: Socket) {
    this.users.logoutDevice(client.id);
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('read_all_notifications')
  async readAllNotifications(
    @Request() request: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.debug(`Reading all notifications for user ${request.user}`);
      await this.notificationsService.readAllUserNotifications(request.user);

      client.emit('notifications_read');

      const userSockets = this.users.getUserSocketsById(request.user);

      userSockets.forEach((socketId) => {
        if (socketId !== client.id) {
          client.to(socketId).emit('notifications_read');
        }
      });
    } catch (error) {
      this.logger.error(
        `Error reading all notifications for user ${request.user}:`,
        error,
      );
      throw new WsException(
        error instanceof Error
          ? error.message
          : 'Failed to read all notifications',
      );
    }
  }
}
