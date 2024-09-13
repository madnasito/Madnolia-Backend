import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
export type MatchDocument = HydratedDocument<Match>;
export declare class Match {
    game: any;
    platform: number;
    date: number;
    user: User;
    inviteds: Array<User>;
    title: string;
    likes: User[];
    active: boolean;
    tournament: boolean;
}
export declare const MatchSchema: mongoose.Schema<Match, mongoose.Model<Match, any, any, any, mongoose.Document<unknown, any, Match> & Match & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Match, mongoose.Document<unknown, {}, mongoose.FlatRecord<Match>> & mongoose.FlatRecord<Match> & {
    _id: mongoose.Types.ObjectId;
}>;
