import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
export type MatchDocument = HydratedDocument<Match>;
export declare class Match {
    _id: mongoose.Schema.Types.ObjectId;
    game: any;
    platform: number;
    date: number;
    user: mongoose.Schema.Types.ObjectId;
    inviteds: Array<User>;
    title: string;
    likes: User[];
    private: boolean;
    active: boolean;
    tournament: boolean;
}
export declare const MatchSchema: mongoose.Schema<Match, mongoose.Model<Match, any, any, any, mongoose.Document<unknown, any, Match> & Match & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Match, mongoose.Document<unknown, {}, mongoose.FlatRecord<Match>> & mongoose.FlatRecord<Match> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
