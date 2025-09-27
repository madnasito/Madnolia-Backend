import { Types } from 'mongoose';

export interface NewPlayerToMatch {
  match: Types.ObjectId;
  user: Types.ObjectId;
}
