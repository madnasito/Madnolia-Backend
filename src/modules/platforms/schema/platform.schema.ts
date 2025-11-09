import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PlatformParent } from '../enums/platform-parent.enum';

export type PlatformDocument = HydratedDocument<Platform>;

@Schema()
export class Platform {
  @Prop({
    required: true,
    unique: true,
  })
  apiId: number;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  slug: string;

  @Prop({
    required: true,
    enum: PlatformParent,
  })
  parent: PlatformParent;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
