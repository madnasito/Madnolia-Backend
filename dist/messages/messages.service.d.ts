import { Message } from './schema/messages.schema';
import mongoose, { Model } from 'mongoose';
import { MessageDto } from './dtos/message.dto';
export declare class MessagesService {
    private messageModel;
    constructor(messageModel: Model<Message>);
    create(createMessageDto: MessageDto): Promise<mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }>;
    getRoomMessages(room: string, skip?: number): mongoose.Query<(mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }, {}, Message, "find", {}>;
    update(id: string, text: string): mongoose.Query<mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }, mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }, {}, Message, "findOneAndUpdate", {}>;
    delete(id: string): mongoose.Query<mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }, mongoose.Document<unknown, {}, Message> & Message & {
        _id: mongoose.Types.ObjectId;
    }, {}, Message, "findOneAndDelete", {}>;
}
