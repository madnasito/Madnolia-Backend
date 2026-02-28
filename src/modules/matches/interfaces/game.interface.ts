import { Types } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

export interface GameInterface {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  gameId: number;
  platforms: Platform[];
  background: string;
  screenshots: string[];
  description: string;
}
