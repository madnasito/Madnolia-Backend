import { Logger, UseGuards, Request } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { NotificationsService } from './notifications.service';
import { NotificationEvents } from './enums/notification-events.enum';
import { OnEvent } from '@nestjs/event-emitter';
import { Users } from 'src/modules/users/classes/user';
import { Notification } from './schemas/notification.schema';

@WebSocketGateway()
export class NotificationsGateway {
  private readonly logger = new Logger(NotificationsGateway.name);
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly users: Users,
  ) {}

  @WebSocketServer() io: Server;

  emitStandartNotification(
    userSockets: Array<string>,
    notification: any,
  ): void {
    this.logger.debug('Emitting standart_notification to user ', userSockets);
    this.logger.debug(notification);

    userSockets.forEach((socketId) => {
      const client = this.io.sockets.sockets.get(socketId);

      if (client) {
        this.logger.debug(
          `Emitting standart_notification to socket ID: ${socketId}`,
        );

        client.emit(NotificationEvents.STANDART_NOTIFICATION, notification);
      }
    });
  }

  @OnEvent('notification.created')
  handleNotificationCreated(notification: Notification) {
    this.logger.debug(
      `Received notification.created event for user ${notification.user}`,
    );
    const userSockets = this.users.getUserSocketsById(notification.user);
    this.logger.debug('User sockets: ', userSockets);
    if (userSockets && userSockets.length > 0) {
      this.emitStandartNotification(userSockets, notification);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage(NotificationEvents.DELETE)
  async deleteNotification(
    @Request() request: any,
    @MessageBody() id: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.debug('Deleting notification ', id);
      this.logger.debug(request.user);
      await this.notificationsService.deleteUserNotification(id, request.user);

      // Get the user and validate
      // const user = this.users.getUserBySocketId(client.id);
      // if (!user) {
      //   this.logger.warn(`User not found for socket ID: ${client.id}`);
      //   throw new WsException('User not found');
      // }

      // Get valid socket IDs (excluding empty strings)
      // const userSocketIds: string[] = user.devices
      //   .map((device) => device.socketId)
      //   .filter(
      //     (socketId) => socketId && socketId !== '' && socketId !== client.id,
      //   );

      // Emit to all other user devices
      // if (userSocketIds.length > 0) {
      //   userSocketIds.forEach((socketId) => {
      //     client.to(socketId).emit('notification_deleted', id);
      //   });
      // }

      // Also emit to the current client
      client.emit(NotificationEvents.NOTIFICATION_DELETED, id);
    } catch (error) {
      this.logger.error(`Error deleting notification ${id}:`, error);
      throw new WsException(
        error instanceof Error
          ? error.message
          : 'Failed to delete notification',
      );
    }
  }
}
