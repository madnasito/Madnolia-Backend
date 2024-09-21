"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/users.service");
let Users = class Users {
    constructor(usersService) {
        this.usersService = usersService;
        this.addUser = async (userId, socketId) => {
            const user = await this.usersService.fincOneById(userId);
            if (!user) {
                return;
            }
            const { name, username, thumb, _id } = user;
            this.users.push({ name, username, thumb, _id, socketId, room: '' });
            return this.users;
        };
        this.getUser = (id) => this.users.filter(user => user.socketId === id)[0];
        this.getUserById = (id) => this.users.filter(user => user._id.toString() === id)[0];
        this.getUsers = () => this.users;
        this.getUsersByRoom = (room) => this.users.filter(user => user.room === room);
        this.deleteUser = (id) => {
            let deletedUser = this.getUser(id);
            this.users = this.users.filter(user => user.socketId != id);
            return deletedUser;
        };
        this.users = [];
    }
};
exports.Users = Users;
exports.Users = Users = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], Users);
//# sourceMappingURL=user.js.map