import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectionRequest } from './schemas/connection-request.schema';
import { Model, Types } from 'mongoose';
import { ConnectionRequestStatus } from './enums/connection-status.enum';
import { FriendshipService } from 'src/modules/friendship/friendship.service';
import { CreateFriendshipDto } from 'src/modules/friendship/dtos/create-frindship.dto';
import { FriendshipStatus } from 'src/modules/friendship/enums/friendship-status.enum';

@Injectable()
export class ConnectionRequestService {
  constructor(
    @InjectModel(ConnectionRequest.name)
    private connectionRequestModel: Model<ConnectionRequest>,
    private friendshipService: FriendshipService,
  ) {}

  async create(
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ): Promise<ConnectionRequest> {
    const verifyRequest = await this.connectionRequestModel.findOne({
      sender,
      receiver,
    });

    if (verifyRequest) {
      if (verifyRequest.status != ConnectionRequestStatus.PENDING) {
        try {
          verifyRequest.status = ConnectionRequestStatus.PENDING;
          verifyRequest.updatedAt = new Date(new Date().toISOString()); // UTC ISO
          return verifyRequest.save();
        } catch (error) {
          Logger.error(error);
          throw new ConflictException();
        }
      }
      return verifyRequest;
    }

    const createdRequest = new this.connectionRequestModel({
      sender,
      receiver,
      createdAt: new Date().toISOString(), // created at UTC ISO
    });

    return createdRequest.save();
  }

  findById = async (id: Types.ObjectId): Promise<ConnectionRequest | null> =>
    this.connectionRequestModel.findById(id).exec();

  findAll = async (): Promise<ConnectionRequest[]> =>
    this.connectionRequestModel.find().exec();

  async acceptConnection(
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ): Promise<ConnectionRequest | null> {
    try {
      const requestDb = await this.connectionRequestModel.findOneAndUpdate(
        { sender, receiver, status: ConnectionRequestStatus.PENDING },
        {
          status: ConnectionRequestStatus.ACCEPTED,
          updatedAt: new Date(new Date().toISOString()),
        },
        { new: true },
      );

      const friendshipPayload: CreateFriendshipDto = {
        user1: sender,
        user2: receiver,
        status: FriendshipStatus.ALIVE,
      };

      await this.friendshipService.create(friendshipPayload);

      return requestDb;
    } catch (error) {
      throw error;
    }
  }

  async rejectConnection(
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ): Promise<ConnectionRequest | null> {
    return this.connectionRequestModel.findOneAndUpdate(
      { sender, receiver, status: ConnectionRequestStatus.PENDING },
      {
        status: ConnectionRequestStatus.REJECTED,
        updatedAt: new Date(new Date().toISOString()),
      },
      { new: true },
    );
  }

  async cancelConnection(
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ): Promise<ConnectionRequest | null> {
    return this.connectionRequestModel.findOneAndDelete({
      sender,
      receiver,
      status: ConnectionRequestStatus.PENDING,
    });
  }

  async delete(id: Types.ObjectId): Promise<ConnectionRequest | null> {
    const deletedRequest = await this.connectionRequestModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedRequest) {
      throw new NotFoundException(`Connection request with ID ${id} not found`);
    }
    return deletedRequest;
  }

  findPendingRequestsForUser = async (
    userId: Types.ObjectId,
  ): Promise<ConnectionRequest[]> =>
    this.connectionRequestModel
      .find({ receiver: userId, status: 'pending' })
      .populate('sender')
      .exec();

  async findSentRequestsByUser(
    userId: Types.ObjectId,
  ): Promise<ConnectionRequest[]> {
    return this.connectionRequestModel
      .find({ sender: userId, status: ConnectionRequestStatus.PENDING })
      .exec();
  }

  async findRequestsByUser(
    userId: Types.ObjectId,
  ): Promise<ConnectionRequest[]> {
    return (
      this.connectionRequestModel
        .find({
          $or: [{ sender: userId }, { receiver: userId }],
          status: ConnectionRequestStatus.PENDING,
        })
        // .populate('sender')
        // .populate('receiver')
        .exec()
    );
  }
}
