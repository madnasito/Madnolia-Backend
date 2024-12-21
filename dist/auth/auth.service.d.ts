import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { SignUpDto } from './dtos/sign-up.dtio';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dtos/sign-in.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp: (signUpDto: SignUpDto) => Promise<{
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        };
        token: string;
    }>;
    signIn: (signInDto: SignInDto) => Promise<{
        user: import("mongoose").Document<unknown, {}, User> & User & {
            _id: import("mongoose").Types.ObjectId;
        };
        token: string;
    }>;
    fincOneByUsername: (username: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOneByEmail: (email: string) => Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
