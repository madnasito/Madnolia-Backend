import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Availability } from '../enums/availability.enum';
import { Platform } from 'src/common/enums/platforms.enum';
import { UserDevice } from '../interfaces/user-device.interface';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: true,
  })
  status: boolean;

  @Prop({
    required: true,
  })
  platforms: Array<Platform>;

  @Prop({
    default: 'https://beeimg.com/images/w13588287183.jpg',
  })
  image: string;

  @Prop({
    default: 'https://i.beeimg.com/images/thumb/w13588287183-xs.jpg',
  })
  thumb: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
    default: [],
    validate: [
      (value: any) => value.length <= 1000,
      'List of games must not exceed 1000 items',
    ],
  })
  games: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  notifications: number;

  @Prop({ default: Availability.EVERYONE, enum: Availability })
  availability: Availability;

  @Prop({
    default: [],
    validate: [
      (value: any) => value.length <= 5,
      'List of devices must not exceed 5 items',
    ],
  })
  devices: UserDevice[];

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date })
  modifiedAt: Date;

  @Prop({ type: Date })
  emailModifiedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
