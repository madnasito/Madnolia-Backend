import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    fincOneByUsername: (username: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    findOneByEmail: (email: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    fincOneById: (id: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    getInfo: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    upadte: (user: string, attrs: Partial<User>) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    userExists: (username: string, email: string) => Promise<{}>;
    searchUser: (username: string) => Promise<(mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    resetNotifications: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    getUserPartners: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    addPartner: (user: string, partner: string) => Promise<mongoose.Document<unknown, {}, User> & User & {
        _id: mongoose.Types.ObjectId;
    }>;
    uploadImage: (form: FormData) => Promise<any>;
}
