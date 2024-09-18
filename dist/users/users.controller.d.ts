import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
export declare class UserController {
    private usersService;
    constructor(usersService: UsersService);
    search(username: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>)[]>;
    getInfo(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    resetNotifications(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    userPartners(req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
    update(req: any, body: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").User> & import("./schemas/user.schema").User & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }>>;
}
