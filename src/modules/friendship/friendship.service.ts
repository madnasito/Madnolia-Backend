import { Injectable } from '@nestjs/common';
import { CreateFriendshipDto } from './dtos/create-frindship.dto';
import { Friendship } from './schemas/friendship.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendshipStatus } from './enums/friendship-status.enum';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name) private friendshipModel: Model<Friendship>,
  ) {}

  async create(payload: CreateFriendshipDto): Promise<Friendship> {
    const friendshipDB = await this.findFriendshipByUsers(
      payload.user1,
      payload.user2,
    );

    if (friendshipDB != null)
      return this.updateStatusById(friendshipDB.id, FriendshipStatus.ALIVE);

    const createFrindship = new this.friendshipModel(payload);

    return createFrindship.save();
  }

  fincFriendshipById(id: Types.ObjectId) {
    return this.friendshipModel.findById(id);
  }

  findAllUserFriendships(user: Types.ObjectId, page: number = 1) {
    return this.friendshipModel.find(
      {
        $or: [{ user1: user }, { user2: user }],
        status: FriendshipStatus.ALIVE,
      },
      {},
      {
        sort: { updatedAt: -1 },
        skip: (page - 1) * 20,
        limit: 20,
      },
    );
  }

  async findFriendshipsByUsers(user: Types.ObjectId, users: Types.ObjectId[]) {
    return Promise.all(
      users.map(async (otherUser) => {
        const friendship = await this.friendshipModel.findOne({
          $or: [
            { user1: user, user2: otherUser },
            { user1: otherUser, user2: user },
          ],
        });
        return friendship || null;
      }),
    );
  }

  // Get friendship between two users
  findFriendshipByUsers(user1: Types.ObjectId, user2: Types.ObjectId) {
    return this.friendshipModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });
  }

  // Get all user friendships
  findFriendshipsByUser(user: Types.ObjectId) {
    return this.friendshipModel.find({
      $or: [{ user1: user }, { user2: user }],
    });
  }

  findFriendshipsByIds(user: Types.ObjectId, ids: Types.ObjectId[]) {
    return this.friendshipModel.find({
      _id: { $in: ids },
      $or: [{ user1: user }, { user2: user }],
    });
  }

  updateStatusById(id: Types.ObjectId, status: FriendshipStatus) {
    return this.friendshipModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
  }

  deleteUserFriendships = (
    user: Types.ObjectId,
  ): Promise<{ deletedCount?: number }> =>
    this.friendshipModel.deleteMany({
      $or: [{ user1: user }, { user2: user }],
    });
}
