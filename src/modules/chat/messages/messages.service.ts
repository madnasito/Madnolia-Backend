import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/messages.schema';
import mongoose, { Model, Types } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { MessageType } from './enums/message-type.enum';
import { FriendshipService } from 'src/modules/friendship/friendship.service';
import { MessageBody } from '@nestjs/websockets';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly friendshipService: FriendshipService,
  ) {}

  async create(@MessageBody() createMessageDto: MessageDto) {
    if (createMessageDto.type == MessageType.USER) {
      const friendshipDB = await this.friendshipService.fincFriendshipById(
        createMessageDto.to,
      );

      if (!friendshipDB) throw new NotFoundException();

      if (
        friendshipDB.user1 != createMessageDto.user &&
        friendshipDB.user2 != createMessageDto.user
      )
        throw new UnauthorizedException();
    }
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  getRoomMessages(room: string, skip: number = 0) {
    const limit = 30;
    return this.messageModel.find(
      { to: room },
      {},
      {
        limit: limit,
        skip: skip,
        sort: { _id: -1 },
      },
    );
  }

  async getUserChats(userId: Types.ObjectId): Promise<any> {
    try {
      // 1. Obtener todas las amistades del usuario
      const friendships =
        await this.friendshipService.findFriendshipsByUser(userId);

      // 2. Obtener el último mensaje de cada amistad
      const chats = await Promise.all(
        friendships.map(async (friendship) => {
          // Determinar el ID del otro usuario
          const otherUserId =
            friendship.user1 == userId ? friendship.user2 : friendship.user1;

          // Obtener el último mensaje de esta amistad
          const lastMessage = await this.messageModel
            .findOne({
              to: friendship._id,
              type: MessageType.USER,
            })
            .sort({ date: -1 })
            .lean()
            .exec();

          return {
            _id: friendship._id,
            user: otherUserId,
            lastMessage: lastMessage || null,
            // Puedes añadir más datos de la amistad si los necesitas
            status: friendship.status,
            createdAt: friendship.createdAt,
          };
        }),
      );

      // 3. Filtrar chats que tengan al menos un mensaje y ordenar por fecha
      const filteredChats = chats
        .filter((chat) => chat.lastMessage !== null)
        .sort((a, b) => {
          if (!a.lastMessage) return 1;
          if (!b.lastMessage) return -1;
          return (
            new Date(b.lastMessage.date).getTime() -
            new Date(a.lastMessage.date).getTime()
          );
        });

      return filteredChats;
    } catch (error) {
      Logger.error(`Failed to get user chats: ${error}`);
      throw new Error('Failed to retrieve chat list');
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

    return this.messageModel.find(
      {
        to: friendshipDb.id,
      },
      {},
      {
        limit: 30,
        skip: skip,
        sort: { _id: -1 },
      },
    );
  }

  update(id: string, text: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    return this.messageModel.findByIdAndUpdate(id, { text }, { new: true });
  }

  delete(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('NO_MATCH_FOUND');

    return this.messageModel.findByIdAndDelete(id);
  }

  deleteAllUserMessages = (user: Types.ObjectId) =>
    this.messageModel.deleteMany({ user });
}
