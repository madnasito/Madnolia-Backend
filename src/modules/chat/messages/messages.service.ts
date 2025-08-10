import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import mongoose, { ClientSession, Model, Types } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { MessageType } from './enums/message-type.enum';
import { FriendshipService } from 'src/modules/friendship/friendship.service';
import { MessageBody } from '@nestjs/websockets';
import { MessageRecipient } from './schemas/messages-recipient.schema';
import { MatchesService } from 'src/modules/matches/matches.service';
import { MessageRecipientDTO } from './dtos/message-recipient.dto';
import { MessageStatus } from './enums/message-status.enum';
import { UpdateRecipientStatusDTO } from './dtos/update-recipient-status.dto';
import { FirebaseCloudMessagingService } from 'src/modules/firebase/firebase-cloud-messaging/firebase-cloud-messaging.service';
import { SendNotificationDto } from 'src/modules/firebase/dtos/send-notification.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(MessageRecipient.name)
    private messageRecipientModel: Model<MessageRecipient>,
    private readonly friendshipService: FriendshipService,
    private readonly matchesService: MatchesService,
    private readonly firebaseCloudMessagingService: FirebaseCloudMessagingService,
  ) {}

  async create(@MessageBody() createMessageDto: MessageDto) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      const createdMessage = await this.createMessage(
        createMessageDto,
        session,
      );
      const createdRecipients = await this.createMessageRecipient(
        createdMessage.id,
        createMessageDto.conversation,
        session,
      );

      await session.commitTransaction();

      const notificationPayload: SendNotificationDto = {
        title: createMessageDto.text,
        body: createMessageDto.text,
        data: {
          conversation: createMessageDto.conversation.toString(),
          creator: createMessageDto.creator.toString(),
        },
        token: '',
      };

      this.firebaseCloudMessagingService.sendNotification(notificationPayload);

      return createdRecipients.map((createdRecipient) => {
        return {
          id: createdRecipient._id,
          user: createdRecipient.user ? createdRecipient.user : null,
          status: createdRecipient.status,
          text: createdMessage.text,
          type: createdMessage.type,
          conversation: createMessageDto.conversation,
          creator: createMessageDto.creator,
          date: createdMessage.date,
        };
      });
    } catch (error) {
      // Verificar si la transacción ya fue confirmada
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      Logger.error('Error creating message:', error);
      throw new Error('CREATING_MESSAGE');
    } finally {
      await session.endSession();
    }
  }

  async createMessage(
    @MessageBody() createMessageDto: MessageDto,
    session: ClientSession,
  ) {
    switch (createMessageDto.type) {
      case MessageType.USER:
        const friendshipDB = await this.friendshipService.fincFriendshipById(
          createMessageDto.conversation,
        );

        if (!friendshipDB) throw new NotFoundException();

        if (
          friendshipDB.user1 != createMessageDto.creator &&
          friendshipDB.user2 != createMessageDto.creator
        )
          throw new UnauthorizedException();
        break;
      case MessageType.MATCH:
        const matchDb = await this.matchesService.verifyUserInMatch(
          createMessageDto.conversation,
          createMessageDto.creator,
        );

        if (!matchDb) throw new NotFoundException();
        break;

      default:
        throw new UnauthorizedException();
    }

    const createdMessage = new this.messageModel(createMessageDto);

    return createdMessage.save({ session });
  }

  async createMessageRecipient(
    messageId: Types.ObjectId,
    conversationId: Types.ObjectId,
    session: ClientSession,
  ): Promise<MessageRecipient[]> {
    const messageDb = await this.messageModel
      .findById(messageId)
      .session(session);

    switch (messageDb.type) {
      case MessageType.USER:
        const friendship =
          await this.friendshipService.fincFriendshipById(conversationId);

        const recipient1 = new this.messageRecipientModel({
          conversation: conversationId,
          message: messageId,
          user: friendship.user1,
          status: MessageStatus.SENT,
        });
        await recipient1.save({ session });

        const recipient2 = new this.messageRecipientModel({
          conversation: conversationId,
          message: messageId,
          status: MessageStatus.SENT,
          user: friendship.user2,
        });
        await recipient2.save({ session });

        return [recipient1, recipient2];

      case MessageType.MATCH:
        const newRecipient = new this.messageRecipientModel({
          conversation: conversationId,
          message: messageId,
          status: MessageStatus.SENT,
        });
        await newRecipient.save({ session });
        return [newRecipient];

      default:
        throw new Error('INVALID_MESSAGE_TYPE');
    }
  }

  async getRoomMessages(
    room: string,
    skip: number = 0,
    user: Types.ObjectId = null,
  ): Promise<MessageRecipientDTO[]> {
    const limit = 30;
    const recipients = await this.messageRecipientModel.find(
      { conversation: room, $or: [{ user: null }, { user }] },
      {},
      {
        limit: limit,
        skip: skip,
        sort: { _id: -1 },
        populate: { path: 'message' },
      },
    );

    return recipients.map((recipient) => {
      const messageMapped: MessageRecipientDTO = {
        id: recipient.id,
        status: recipient.status,
        conversation: recipient.conversation,
        text: recipient.message.text,
        type: recipient.message.type,
        creator: recipient.message.creator,
        date: recipient.message.date,
      };
      return messageMapped;
    });
  }

  async getUserChats(userId: Types.ObjectId) {
    try {
      // 1. Obtener todas las amistades del usuario
      const friendships =
        await this.friendshipService.findFriendshipsByUser(userId);
      if (!friendships?.length) return [];

      // 2. Preparar IDs de conversaciones
      const conversationsIds = friendships.map(
        (f) => new Types.ObjectId(f._id || f.id),
      );

      // 3. Agregación optimizada
      const results = await this.messageRecipientModel.aggregate([
        {
          $match: {
            conversation: { $in: conversationsIds },
            // user: userId, // Solo mensajes destinados a este usuario
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'message',
            foreignField: '_id',
            as: 'message',
          },
        },
        {
          $unwind: '$message',
        },
        // Ordenar por fecha descendente antes de agrupar
        {
          $sort: { _id: -1 },
        },
        // Agrupar por conversación para obtener el último mensaje
        {
          $group: {
            _id: '$conversation',
            latestRecipient: { $first: '$$ROOT' },
            // Contar mensajes no leídos del otro usuario
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$status', MessageStatus.SENT] },
                      { $ne: ['$message.creator', userId] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        // Proyectar los campos necesarios
        {
          $project: {
            unreadCount: 1,
            message: {
              id: '$latestRecipient._id',
              conversation: '$_id',
              user: '$latestRecipient.user',
              text: '$latestRecipient.message.text',
              creator: '$latestRecipient.message.creator',
              type: '$latestRecipient.message.type',
              date: '$latestRecipient.message.date',
              status: '$latestRecipient.status',
            },
          },
        },
        // Ordenar final por fecha del mensaje más reciente
        {
          $sort: {
            'message.date': -1,
          },
        },
      ]);

      return results;
    } catch (error) {
      console.error('Error en getUserChats:', error);
      throw new Error('Error al obtener chats del usuario');
    }
  }

  async getUserChatMessages(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
    skip: number = 0,
  ) {
    const friendshipDb = await this.friendshipService.findFriendshipByUsers(
      user1,
      user2,
    );

    if (!friendshipDb) throw new NotFoundException();

    return this.getRoomMessages(friendshipDb.id, skip, user1);
  }

  updateRecipientStatus = async (
    user: Types.ObjectId,
    body: UpdateRecipientStatusDTO,
  ) => {
    const recipientMessage = await this.messageRecipientModel.findOne({
      _id: body.id,
      $or: [{ user }, { user: null }],
    });

    if (!recipientMessage) throw new NotFoundException();

    // First perform the update
    const updateResult = await this.messageRecipientModel.updateMany(
      {
        message: recipientMessage.message,
      },
      {
        status: body.status,
      },
    );

    if (!updateResult.acknowledged) throw new BadRequestException();

    // Then find the updated documents
    const recipients = await this.messageRecipientModel
      .find({
        message: recipientMessage.message,
      })
      .lean();

    return recipients;
  };

  updateMessage(id: string, text: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    return this.messageModel.findByIdAndUpdate(id, { text }, { new: true });
  }

  delete(id: Types.ObjectId) {
    return this.messageRecipientModel.findByIdAndUpdate(id, {
      status: MessageStatus.DELETED,
    });
  }

  deleteAllUserMessages = (user: Types.ObjectId) =>
    this.messageModel.deleteMany({ user });

  deleteAllUserMessagesRecipients = (user: Types.ObjectId) =>
    this.messageRecipientModel.deleteMany({ user });
}
