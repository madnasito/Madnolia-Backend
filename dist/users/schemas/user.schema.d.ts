import mongoose, { HydratedDocument } from 'mongoose';
import { Game } from 'src/games/schemas/game.schema';
import { Availability } from './availability.enum';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    name: string;
    username: string;
    email: string;
    password: string;
    status: boolean;
    platforms: Array<number>;
    img: string;
    thumb: string;
    partners: User[];
    games: Game[];
    notifications: number;
    availability: Availability;
    createdAt: Date;
    modifiedAt: Date;
    deletedAt: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: mongoose.Types.ObjectId;
}>;
