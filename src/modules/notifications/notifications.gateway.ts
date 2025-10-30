import { Logger, UseGuards, Request } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
  private readonly logger: Logger;
  constructor(private readonly notificationsService: NotificationsService) {}
  @UseGuards(UserSocketGuard)
  @SubscribeMessage('delete_notification')
  async deleteNotification(
    @Request() request: any,
    @MessageBody() id: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      this.logger.debug('Deleting notification ' + id);
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
      client.emit('notification_deleted', id);
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
