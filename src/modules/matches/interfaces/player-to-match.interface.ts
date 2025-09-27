import { Types } from 'mongoose';

export interface NewPlayerToMatch {
  match: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: string;
    thumb: string;
    username: string;
  };
}
