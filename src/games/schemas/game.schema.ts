import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    slug: string;

    @Prop({ 
        required: true
    })
    gameId: number;

    @Prop({
         required: true
    })
    platforms: [
        { id: number, amount: number}
    ];

    @Prop({
        // required: true
    })
    background: string;

    @Prop({
        // required: true
    })
    screenshots: String[];

    @Prop({
        required: true
    })
    description: string;

}

export const GameSchema = SchemaFactory.createForClass(Game);