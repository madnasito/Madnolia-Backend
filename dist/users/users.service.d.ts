import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    fincOneByUsername: (username: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    findOneByEmail: (email: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    fincOneById: (id: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    getInfo: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    upadte: (user: string, attrs: Partial<User>) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    searchUser: (username: string) => Promise<(mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>)[]>;
    resetNotifications: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    getUserPartners: (user: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
    addPartner: (user: string, partner: string) => Promise<mongoose.Document<unknown, {}, User> & User & Required<{
        _id: mongoose.Schema.Types.ObjectId;
    }>>;
}
