import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FriendshipStatus } from '../enums/friendship-status.enum';

export type FriendshipDocument = HydratedDocument<Friendship>;

@Schema()
export class Friendship {
  @Prop({
    required: true,
    ref: 'User',
  })
  user1: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'User',
  })
  user2: Types.ObjectId;

  @Prop({
    default: FriendshipStatus.ALIVE,
  })
  status: FriendshipStatus;

  @Prop({
    default: new Date(),
  })
  createdAt: Date;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
