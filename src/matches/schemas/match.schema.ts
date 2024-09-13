import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type MatchDocument = HydratedDocument<Match>;

@Schema()
export class Match {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    })
    game: any;

    @Prop({
        required: true
    })
    platform: number;

    @Prop({
        required: true
    })
    date: number;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    user: mongoose.Schema.Types.ObjectId;

    @Prop({
        required: true,
        type: [mongoose.Schema.Types.ObjectId]
    })
    inviteds: Array<User>;

    @Prop({
        required: true
    })
    title: string;

    @Prop({
        required: true
    })
    likes: User[];

    @Prop({
        default: true
    })
    active: boolean;

    @Prop({
        default: false
    })
    tournament: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);