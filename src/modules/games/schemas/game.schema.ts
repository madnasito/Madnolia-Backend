import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
    unique: true,
  })
  gameId: number;

  @Prop({
    required: true,
  })
  platforms: [{ id: number; amount: number }];

  @Prop({
    // required: true
    default: '',
  })
  background: string;

  @Prop({
    // required: true
  })
  screenshots: string[];

  @Prop({
    default: '',
  })
  description: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
