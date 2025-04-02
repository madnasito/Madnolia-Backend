import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/messages.schema';
import mongoose, { Model, Types } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
import { MessageType } from './enums/message-type.enum';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly usersService: UsersService,
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
      // 1. Fetch all messages sorted by date (newest first)
      const allMessages = await this.messageModel
        .find({
          $or: [
            { user: userId, type: MessageType.USER },
            { to: userId, type: MessageType.USER },
          ],
        })
        .sort({ date: -1 })
        .populate('to', '_id name username thumb')
        .lean()
        .exec();
  
      // 2. Group messages by chat partner (most recent message per chat)
      const chatMap = new Map<string, { user: any; lastMessage: any }>();
  
      for (const message of allMessages) {
        const otherUserId = message.user.equals(userId)
          ? message.to._id.toString()
          : message.user._id.toString();
  
        if (!chatMap.has(otherUserId)) {
          const otherUser = message.user.equals(userId) ? message.to : message.user;
          chatMap.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
          });
        }
      }
  
      // 3. Process and populate user data
      const chats = Array.from(chatMap.values());
      const finalChats = [];
  
      for (const chat of chats) {
        try {
          // Determine the correct other user
          let otherUser: Types.ObjectId;
          if (chat.user._id.equals(userId)) {
            otherUser = chat.lastMessage.user.equals(userId)
              ? chat.lastMessage.to._id
              : chat.lastMessage.user._id;
          } else {
            otherUser = chat.user._id;
          }
  
          // Populate user data
          const populatedUser = await this.usersService.fincOneMinimalById(otherUser);
  
          finalChats.push({
            user: populatedUser,
            lastMessage: chat.lastMessage,
          });
        } catch (error) {
          Logger.error(`Error processing chat for user ${chat.user._id}: ${error}`);
          continue;
        }
      }
  
      // 4. Sort chats by most recent message date
      finalChats.sort((a, b) => 
        new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime()
      );
  
      return finalChats;
    } catch (error) {
      Logger.error(`Failed to get user chats: ${error}`);
      throw new Error('Failed to retrieve chat list');
    }
  }

  getUserChatMessages(
    user1: Types.ObjectId,
    user2: Types.ObjectId,
    skip: number = 0,
  ) {
    return this.messageModel.find(
      {
        $or: [
          { user: user1, to: user2 },
          { user: user2, to: user1 },
        ],
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
