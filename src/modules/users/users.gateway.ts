import { Logger, UseGuards } from '@nestjs/common';
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

@WebSocketGateway()
export class UsersGateway {
  constructor(
    private readonly usersService: UsersService,
    private users: Users,
  ) {}

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('request_connection')
  async requestNewConnection(
    @MessageBody() requestedUser: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.users.getUser(client.id);
    Logger.debug('Requester user ' + user.name);
    const requested = await this.usersService.fincOneById(requestedUser);
    if (!requested) throw new WsException('USER_NOT_FOUND');
    Logger.debug('Requested user ' + requested.name);
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('reject_connection')
  async rejectConnection(
    @MessageBody() requestedUser: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.users.getUser(client.id);
    Logger.debug('Requested user ' + user.name);
    const requester = await this.usersService.fincOneById(requestedUser);
    if (!requester) throw new WsException('USER_NOT_FOUND');
    Logger.debug('Requester user ' + requester.name);
  }
}
