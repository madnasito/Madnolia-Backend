import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectionRequest } from './schemas/connection-request.schema';
import { Model, Types } from 'mongoose';
import { ConnectionRequestStatus } from './enums/connection-status.enum';

@Injectable()
export class ConnectionRequestService {
  constructor(
    @InjectModel(ConnectionRequest.name)
    private connectionRequestModel: Model<ConnectionRequest>,
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
      if (verifyRequest.status != ConnectionRequestStatus.PENDING)
        throw new ConflictException();
      return verifyRequest;
    }

    const createdRequest = new this.connectionRequestModel({
      sender,
      receiver,
    });
    return createdRequest.save();
  }

  findById = async (id: Types.ObjectId): Promise<ConnectionRequest | null> =>
    this.connectionRequestModel.findById(id).exec();

  findAll = async (): Promise<ConnectionRequest[]> =>
    this.connectionRequestModel.find().exec();

  async updateStatus(
    id: Types.ObjectId,
    user: Types.ObjectId,
    status: ConnectionRequestStatus.ACCEPTED | ConnectionRequestStatus.REJECTED,
  ): Promise<ConnectionRequest | null> {
    return this.connectionRequestModel.findOneAndUpdate(
      { _id: id, receiver: user },
      { status, updatedAt: new Date() },
      { new: true },
    );
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
