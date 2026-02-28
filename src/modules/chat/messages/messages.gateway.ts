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
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';
// import { UserGuard } from 'src/common/guards/user.guard';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { MessageDto } from './dtos/message.dto';
import { Users } from '../../users/classes/user';
import { MatchesService } from 'src/modules/matches/matches.service';
import { UpdateRecipientStatusDTO } from './dtos/update-recipient-status.dto';
import { MessageType } from './enums/message-type.enum';
import { FirebaseCloudMessagingService } from 'src/modules/firebase/firebase-cloud-messaging/firebase-cloud-messaging.service';
import { SendNotificationDto } from 'src/modules/firebase/dtos/send-notification.dto';
// import { SendNotificationDto } from 'src/modules/firebase/dtos/send-notification.dto';

@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      const logger = new Logger('MessagesGateway');
      logger.error('Validation errors:', JSON.stringify(errors, null, 2));
      return new WsException({
        status: 'error',
        message: 'Validation failed',
        errors: errors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    },
  }),
)
@WebSocketGateway({
  // namespace: 'messages'
})
export class MessagesGateway implements OnGatewayInit, OnGatewayDisconnect {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly matchesService: MatchesService,
    private users: Users,
    private firebaseCloudMessagingService: FirebaseCloudMessagingService,
  ) {}

  @WebSocketServer() io: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Initialized`);
  }

  handleDisconnect(client: any) {
    this.users.deleteUserSocketId(client.id);
    this.logger.debug(`Cliend id:${client.id} disconnected`);
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('init_chat')
  async handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = this.users.getUserBySocketId(client.id);
      if (user) {
        user.room = data;
      }
      await client.join(data);
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
        content: payload.content,
        type: payload.type,
      };
      const messageRecipients = await this.messagesService.create(message);
      if (!messageRecipients) throw new WsException('NO_MESSAGE');

      if (payload.type == MessageType.USER) {
        const data = messageRecipients.find(
          (message) => message.user != request.user,
        );

        if (!data) throw new WsException('NO_MESSAGE');

        const creator = this.users.getUserById(data.creator);

        if (!creator) throw new WsException('NO_MESSAGE');

        if (!data.user) throw new WsException('NO_MESSAGE');

        const userData = this.users.getUserById(data.user);

        if (!userData) throw new WsException('NO_MESSAGE');

        if (userData) {
          try {
            const userFcms = this.users.getUserFcmTokensNoSocketById(
              userData._id,
            );

            if (userFcms.length > 0) {
              this.logger.debug(userFcms);
              this.logger.debug('Sending user message');
              const notificationPayload: SendNotificationDto = {
                body: data.content,
                title: creator.name,
                data: {
                  type: 'chat_message',
                  data: JSON.stringify(data),
                },
                tokens: userFcms,
              };
              await this.firebaseCloudMessagingService.sendToMultipleTokens(
                notificationPayload,
              );
            }
          } catch (error) {
            this.logger.error(error);
          }
        }

        client
          .to(messageRecipients[0].conversation.toString())
          .emit('message', data);
        client.emit('sended_message', {
          uid: payload.id,
          message: messageRecipients.find(
            (message) => message.user == request.user,
          ),
        });
      } else {
        const messageRecipient = messageRecipients[0];

        const players = await this.matchesService.getPlayersInMatch(
          messageRecipient.conversation,
        );

        Logger.debug(players);

        const fcmTokens =
          this.users.getUsersFcmTokensWithoutSocketById(players);

        this.logger.debug(fcmTokens);

        if (fcmTokens.length > 0) {
          const notificationPayload: SendNotificationDto = {
            body: messageRecipient.content,
            title: 'Match message',
            data: {
              type: 'chat_message',
              data: JSON.stringify(messageRecipient),
            },
            tokens: fcmTokens,
          };
          await this.firebaseCloudMessagingService.sendToMultipleTokens(
            notificationPayload,
          );
        }

        client
          .to(messageRecipient.conversation.toString())
          .emit('message', messageRecipient);
        client.emit('sended_message', {
          uid: payload.id,
          message: messageRecipient,
        });
      }
    } catch (error) {
      console.error('Error in handleMessage:');
      console.error(error);
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
      const user = this.users.getUserBySocketId(client.id);
      if (user) {
        user.room = '';
      }
      return true;
    } catch (error) {
      Logger.error(error);
      throw new WsException(error);
    }
  }
}
