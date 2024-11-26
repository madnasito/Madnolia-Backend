import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Game } from 'src/games/schemas/game.schema';
import { Group } from 'src/groups/schema/group.schema';
import { User } from 'src/users/schemas/user.schema';

export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  })
  game: Game;

  @Prop({
    required: true,
  })
  platform: number;

  @Prop({
    required: true,
  })
  date: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  })
  group: Group;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  inviteds: Array<User>;

  @Prop({
    default: 'Casual',
    maxlength: 25,
  })
  title: string;

  @Prop({
    type: Number,
    default: 60,
    max: 99,
    min: 5,
  })
  duration: number;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  likes: User[];

  @Prop({
    default: false,
  })
  private: boolean;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop({
    default: false,
  })
  tournament: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
