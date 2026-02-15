import { Types } from 'mongoose';
import { UserDevice } from './user-device.interface';

export interface User {
  name: string;
  username: string;
  thumb: string;
  _id: Types.ObjectId;
  devices: UserDevice[];
  room: string;
}
