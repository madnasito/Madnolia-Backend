import { Types } from 'mongoose';
import { GameInterface } from './game.interface';
import { Platform } from 'src/common/enums/platforms.enum';

export interface MatchWithGame {
  _id: Types.ObjectId;

  title: string;

  description: string;

  user: Types.ObjectId;

  platform: Platform;

  game: GameInterface;

  date: Date;

  inviteds: Array<Types.ObjectId>;

  joined: Array<Types.ObjectId>;

  tournament: string;
}
