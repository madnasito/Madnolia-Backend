import mongoose, { HydratedDocument } from 'mongoose';
import { Game } from 'src/games/schemas/game.schema';
import { Group } from 'src/groups/schema/group.schema';
import { User } from 'src/users/schemas/user.schema';
export type MatchDocument = HydratedDocument<Match>;
export declare class Match {
    game: Game;
    platform: number;
    date: number;
    user: User;
    group: Group;
    inviteds: Array<User>;
    title: string;
    likes: User[];
    private: boolean;
    active: boolean;
    tournament: boolean;
}
export declare const MatchSchema: mongoose.Schema<Match, mongoose.Model<Match, any, any, any, mongoose.Document<unknown, any, Match> & Match & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Match, mongoose.Document<unknown, {}, mongoose.FlatRecord<Match>> & mongoose.FlatRecord<Match> & {
    _id: mongoose.Types.ObjectId;
}>;
