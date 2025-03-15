import { UseGuards, Request, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { UsersService } from './users.service';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
import { Users } from './classes/user';
import { Socket } from 'socket.io';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { ConnectionRequestStatus } from './connection-request/enums/connection-status.enum';
import { Types } from 'mongoose';
// import { Types } from 'mongoose';

@WebSocketGateway()
export class UsersGateway {
  constructor(
    private readonly usersService: UsersService,
    private readonly connectionRequestService: ConnectionRequestService,
    private users: Users,
  ) {}

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('request_connection')
  async requestNewConnection(
    @MessageBody() requestedUser: string,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    const requested = await this.usersService.fincOneById(requestedUser);
    if (!requested) throw new WsException('USER_NOT_FOUND');
    const requestDb = await this.connectionRequestService.create(
      request.user,
      requested.id,
    );
    client.emit('new_request_connection', requestDb);
    return requestDb;
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('accept_connection')
  async acceptConnection(
    @MessageBody() requestId: Types.ObjectId,
    @ConnectedSocket() client: Socket,
    @Request() request: any,
  ) {
    try {
      const connectionRequestDb =
        await this.connectionRequestService.updateStatus(
          requestId,
          request.user,
          ConnectionRequestStatus.ACCEPTED,
        );
      await this.usersService.addPartner(
        connectionRequestDb.receiver,
        connectionRequestDb.sender,
      );

      client.emit('accept_connection', connectionRequestDb);
      return connectionRequestDb;
    } catch (error) {
      Logger.error(error);
      throw new WsException('NOT_FOUND_REQUEST_CONNECTION');
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('reject_connection')
  async rejectConnection(
    @MessageBody() requestId: Types.ObjectId,
    @Request() request: any,
  ) {
    return this.connectionRequestService.updateStatus(
      requestId,
      request.user,
      ConnectionRequestStatus.REJECTED,
    );
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
}
