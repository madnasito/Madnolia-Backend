import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';
import { SignInDto } from './dtos/sign-in.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(body: SignUpDto): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User> & import("../users/schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        token: string;
    }>;
    signin(body: SignInDto): Promise<{
        user: import("mongoose").Document<unknown, {}, import("../users/schemas/user.schema").User> & import("../users/schemas/user.schema").User & {
            _id: import("mongoose").Types.ObjectId;
        };
        token: string;
    }>;
}
