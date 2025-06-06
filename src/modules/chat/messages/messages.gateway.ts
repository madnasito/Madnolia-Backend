import {
  Logger,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
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
import { UserGuard } from 'src/common/guards/user.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageDto } from './dtos/message.dto';
import { Users } from '../../users/classes/user';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from 'src/modules/friendship/friendship.service';
import { MatchesService } from 'src/modules/matches/matches.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  // namespace: 'messages'
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
    private readonly friendshipService: FriendshipService,
    private readonly matchesService: MatchesService,
    private users: Users,
  ) {}

  @WebSocketServer() io: Namespace;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Initialized`);
  }

  @UseGuards(UserGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { size } = this.io.sockets;

      const { token } = client.handshake.headers;

      if (token === undefined || token === null || token === '') {
        client.disconnect(true);
        throw new WsException('MISSING_TOKEN');
      }

      const tokenPayload = await this.jwtService.verifyAsync(token as string);
      await this.users.addUser(tokenPayload.id, client.id);

      const friendshipsIds = (
        await this.friendshipService.findFriendshipsByUser(tokenPayload.id)
      ).map((e) => e.id);

      const userMatchesIds: string[] = (
        await this.matchesService.getMatchesJoinedOrCreatedByUser(
          tokenPayload.id,
        )
      ).map((match) => match.id);

      userMatchesIds.forEach((id) => client.join(id));

      friendshipsIds.forEach((element) => client.join(element));

      this.logger.debug(`Client id: ${client.id} connected`);
      this.logger.debug(`Number of connected clients: ${size}`);
    } catch (error) {
      return new WsException(error);
    }
  }

  handleDisconnect(client: any) {
    this.users.deleteUser(client.id);
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('init_chat')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    try {
      this.users.getUser(client.id).room = data;
      client.join(data);
      return true;
    } catch (error) {
      throw new WsException(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @Request() request: any,
    @MessageBody() payload: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.debug(`Message received from client id: ${client.id}`);

      const message: MessageDto = {
        to: payload.to,
        user: request.user,
        text: payload.text,
        type: payload.type,
      };
      const messageSaved = await this.messagesService.create(message);
      if (!messageSaved) throw new WsException('NO_MESSAGE');

      const { text, _id, date } = messageSaved;
      // const user = this.users.getUserById(request.user);

      // Payload to emit to user
      const payloadEvent = {
        _id,
        text,
        date,
        to: payload.to,
        user: request.user,
        type: payload.type,
      };

      this.logger.debug(`${this.users.getUser(client.id).room}`);

      client.to(messageSaved.to.toString()).emit('message', payloadEvent);

      client.emit('message', payloadEvent);
    } catch (error) {
      console.log(error);
      throw new WsException(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('disconnect_chat')
  handleDisconnectChat(@ConnectedSocket() client: Socket) {
    try {
      this.logger.debug(`Leaved the room: ${client.id}`);
      this.users.getUser(client.id).room = '';
      return true;
    } catch (error) {
      console.log(error);
      throw new WsException(error);
    }
  }
}
