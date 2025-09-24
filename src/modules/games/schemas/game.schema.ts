import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Platform } from 'src/common/enums/platforms.enum';

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
  platforms: Platform[];
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
