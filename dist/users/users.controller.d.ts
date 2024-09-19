import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
export declare class UserController {
    private usersService;
    constructor(usersService: UsersService);
    search(username: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    userExists(username: string, email: string): Promise<{}>;
    getInfo(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    resetNotifications(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    userPartners(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(req: any, body: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
