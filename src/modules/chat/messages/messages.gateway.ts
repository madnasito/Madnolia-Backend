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
import { UpdateRecipientStatusDTO } from './dtos/update-recipient-status.dto';
import { MessageType } from './enums/message-type.enum';

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
        await this.matchesService.getActiveMatchesJoinedOrCreatedByUser(
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
        conversation: payload.conversation,
        creator: request.user,
        text: payload.text,
        type: payload.type,
      };
      const messageRecipients = await this.messagesService.create(message);
      if (!messageRecipients) throw new WsException('NO_MESSAGE');

      if (payload.type == MessageType.USER) {
        const data = messageRecipients.find(
          (message) => message.user != request.user,
        );
        client
          .to(messageRecipients[0].conversation.toString())
          .emit('message', data);
        client.emit(
          'message',
          messageRecipients.find((message) => message.user == request.user),
        );
      } else {
        const messageRecipient = messageRecipients[0];
        client
          .to(messageRecipient.conversation.toString())
          .emit('message', messageRecipient);
        client.emit('message', messageRecipient);
      }
    } catch (error) {
      console.log(error);
      throw new WsException(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('update_recipient_status')
  async updateRecipientStatus(
    @Request() request: any,
    @MessageBody() payload: UpdateRecipientStatusDTO,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedMessageRecipients =
        await this.messagesService.updateRecipientStatus(request.user, payload);

      // Find the recipient for other users
      const recipientForOthers = updatedMessageRecipients.find(
        (message) => message.user.toString() !== request.user,
      );

      // Find the recipient for the current user
      const recipientForUser = updatedMessageRecipients.find(
        (message) => message.user.toString() === request.user,
      );

      // Emit to room (other users in conversation)
      if (recipientForOthers) {
        client
          .to(recipientForOthers.conversation.toString())
          .emit('message_recipient_update', {
            id: recipientForOthers._id,
            status: recipientForOthers.status,
          });
      }

      // Emit to current user
      if (recipientForUser) {
        client.emit('message_recipient_update', {
          id: recipientForUser._id,
          status: recipientForUser.status,
        });
      }
    } catch (error) {
      Logger.error(error);
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
      Logger.error(error);
      throw new WsException(error);
    }
  }
}
