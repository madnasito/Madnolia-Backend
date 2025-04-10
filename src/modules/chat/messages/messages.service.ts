import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/messages.schema';
import mongoose, { Model, Types } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { MessageType } from './enums/message-type.enum';
import { UsersService } from 'src/modules/users/users.service';
import { FriendshipService } from 'src/modules/friendship/friendship.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly usersService: UsersService,
    private readonly friendshipService: FriendshipService,
  ) {}

  create(createMessageDto: MessageDto) {
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
        populate: { path: 'user', select: '_id name username thumb' },
        sort: { _id: -1 },
      },
    );
  }

  async getUserChats(userId: Types.ObjectId): Promise<any> {
    try {
      // OBtener todas las amistades del usuario, luego tomas sus id, luego buscar en messages en base al id, que sea
      // el de la sala, pero tomar solamente un solo campo y luego hacer que no se repita los to para que solo tome uno
      // (el primero) y agregar un populate del usuario que no sea el del request a cada dato del array

      // 1. Obtener todas las amistades del usuario
      const friendships =
        await this.friendshipService.findFriendshipsByUser(userId);
      // 2. Si no tiene amigos, retornar array vacío
      if (friendships.length === 0) {
        return [];
      }

      // 3. Obtener IDs de las amistades
      const friendshipIds = friendships.map((friendship) => friendship.id);

      // 4. Buscar mensajes asociados a estas amistades
      const allMessages: any = await this.messageModel
        .find({
          to: { $in: friendshipIds },
          type: MessageType.USER,
        })
        .sort({ date: -1 })
        .populate('user', '_id name username thumb')
        .populate({
          path: 'to',
          populate: {
            path: 'user1 user2',
            select: '_id name username thumb',
          },
        })
        .lean()
        .exec();

      // 5. Procesar los mensajes y agrupar por amistad
      const chatMap = new Map<
        string,
        { friendship: any; lastMessage: any; otherUser: any }
      >();

      for (const message of allMessages) {
        const friendship = message.to;
        const otherUser = friendship.user1._id.equals(userId)
          ? friendship.user2
          : friendship.user1;

        if (!chatMap.has(friendship._id.toString())) {
          chatMap.set(friendship._id.toString(), {
            friendship: friendship,
            lastMessage: message,
            otherUser: otherUser,
          });
        }
      }

      // 6. Construir la lista final de chats
      const finalChats = Array.from(chatMap.values()).map((chat) => ({
        friendship: {
          _id: chat.friendship._id,
          // Puedes incluir más datos de la amistad si es necesario
        },
        user: chat.otherUser,
        lastMessage: chat.lastMessage,
      }));

      // 7. Ordenar chats por fecha del último mensaje (más reciente primero)
      finalChats.sort(
        (a, b) =>
          new Date(b.lastMessage.date).getTime() -
          new Date(a.lastMessage.date).getTime(),
      );

      return finalChats;
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
}
