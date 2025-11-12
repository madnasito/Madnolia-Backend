import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Group } from 'src/modules/groups/schema/group.schema';
import { MatchStatus } from '../enums/status.enum';
import { Platform } from 'src/common/enums/platforms.enum';

export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  })
  game: Types.ObjectId;

  @Prop({
    required: true,
  })
  platform: Platform;

  @Prop({
    required: true,
  })
  date: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  })
  group: Group;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  inviteds: Array<Types.ObjectId>;

  @Prop({
    default: 'Casual',
    maxlength: 30,
  })
  title: string;

  @Prop({
    default: 'Casual',
    maxlength: 80,
  })
  description: string;

  @Prop({
    type: Number,
    default: 60,
    max: 99,
    min: 5,
  })
  duration: number;

  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  joined: Types.ObjectId[];

  @Prop({
    default: false,
  })
  private: boolean;

  @Prop({
    default: null,
  })
  tournament: string;

  @Prop({
    enum: MatchStatus,
    default: MatchStatus.WAITING,
  })
  status: MatchStatus;

  @Prop({
    required: true,
  })
  createdAt: Date;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
