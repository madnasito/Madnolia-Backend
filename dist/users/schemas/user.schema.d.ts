import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    username: string;
    email: string;
    password: string;
    status: boolean;
    platforms: Array<number>;
    img: string;
    imgThumb: string;
    partners: User[];
    notifications: number;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
