import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/schemas/user.schema";
export type MessageDocument = HydratedDocument<Message>;
export declare class Message {
    to: string;
    user: User;
    text: string;
    date: Date;
}
export declare const MessageSchema: mongoose.Schema<Message, mongoose.Model<Message, any, any, any, mongoose.Document<unknown, any, Message> & Message & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Message, mongoose.Document<unknown, {}, mongoose.FlatRecord<Message>> & mongoose.FlatRecord<Message> & {
    _id: mongoose.Types.ObjectId;
}>;
