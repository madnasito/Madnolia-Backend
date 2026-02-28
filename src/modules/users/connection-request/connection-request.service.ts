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
import { Friendship } from 'src/modules/friendship/schemas/friendship.schema';

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
    const existingRequest = await this.connectionRequestModel.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === ConnectionRequestStatus.PENDING) {
        return existingRequest;
      }

      try {
        existingRequest.sender = sender;
        existingRequest.receiver = receiver;
        existingRequest.status = ConnectionRequestStatus.PENDING;
        existingRequest.updatedAt = new Date();
        return await existingRequest.save();
      } catch (error) {
        Logger.error(error);
        throw new ConflictException();
      }
    }

    const createdRequest = new this.connectionRequestModel({
      sender,
      receiver,
      createdAt: new Date(),
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
  ): Promise<{
    request: ConnectionRequest;
    friendship: Friendship;
  }> {
    const requestDb = await this.connectionRequestModel.findOneAndUpdate(
      { sender, receiver, status: ConnectionRequestStatus.PENDING },
      {
        status: ConnectionRequestStatus.ACCEPTED,
        updatedAt: new Date(new Date().toISOString()),
      },
      { new: true },
    );

    if (!requestDb) {
      throw new NotFoundException(
        `Connection request from ${sender} to ${receiver} not found`,
      );
    }

    const friendshipPayload: CreateFriendshipDto = {
      user1: sender,
      user2: receiver,
      status: FriendshipStatus.ALIVE,
    };

    const friendshipDb = await this.friendshipService.create(friendshipPayload);

    return { request: requestDb, friendship: friendshipDb };
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

  findOneByUserIds = async (
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
  ): Promise<ConnectionRequest | null> =>
    this.connectionRequestModel
      .findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      })
      .exec();

  findPendingRequestsForUser = async (
    userId: Types.ObjectId,
  ): Promise<ConnectionRequest[]> =>
    this.connectionRequestModel
      .find({ receiver: userId, status: ConnectionRequestStatus.PENDING })
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
