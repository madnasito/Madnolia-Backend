import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dtio';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(body: SignUpDto): Promise<import("mongoose").Document<unknown, {}, import("../user/schemas/user.schema").User> & import("../user/schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
