import { UsersService } from "src/users/users.service";
export declare class Users {
    private usersService?;
    users: Array<User>;
    constructor(usersService?: UsersService);
    addUser: (userId: string, socketId: string) => Promise<User[]>;
    getUser: (id: string) => User;
    getUserById: (id: string) => User;
    getUsers: () => User[];
    getUsersByRoom: (room: string) => User[];
    deleteUser: (id: string) => User;
}
interface User {
    name: string;
    username: string;
    imgThumb: string;
    _id: any;
    socketId: string;
    room: string;
}
export {};
