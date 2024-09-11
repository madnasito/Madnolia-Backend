import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { SignUpDto } from "./dtos/sign-up.dtio";
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<User>);
    signup: (signUpDto: SignUpDto) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    fincOneByUsername: (username: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOneByEmail: (email: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
