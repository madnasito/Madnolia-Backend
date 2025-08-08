import { Types } from 'mongoose';

export interface MatchesByPlatforms {
  _id: Types.ObjectId;
  count: number;
  background: string;
  slug: string;
}
