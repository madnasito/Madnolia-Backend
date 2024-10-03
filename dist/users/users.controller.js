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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const user_guard_1 = require("../guards/user.guard");
const update_user_dto_1 = require("./dtos/update-user.dto");
const serialize_interceptor_1 = require("../interceptors/serialize.interceptor");
const user_dto_1 = require("./dtos/user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let UserController = class UserController {
    constructor(usersService, config) {
        this.usersService = usersService;
        this.config = config;
    }
    async search(username) {
        return this.usersService.searchUser(username);
    }
    async userExists(username, email) {
        return this.usersService.userExists(username, email);
    }
    async getInfo(req) {
        return this.usersService.getInfo(req.user.id);
    }
    async resetNotifications(req) {
        return this.usersService.resetNotifications(req.user.id);
    }
    async userPartners(req) {
        return this.usersService.getUserPartners(req.user.id);
    }
    async update(req, body) {
        return this.usersService.upadte(req.user.id, body);
    }
    async uploadFile(req, img) {
        const validExtension = ['jpg', 'jpeg', 'png'];
        const extension = img.mimetype.split('/')[1];
        if (!validExtension.includes(extension)) {
            throw new common_1.HttpException('Not valid extension', common_1.HttpStatus.BAD_REQUEST);
        }
        const form = new FormData();
        form.append('file', new Blob([img.buffer], { type: img.mimetype }));
        form.append("apikey", "a639124c1b9448e386cdf89e3fa4597f");
        return axios_1.default.post('https://beeimg.com/api/upload/file/json/', form, {
            headers: {
                "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
            }
        })
            .then((resp) => {
            if (resp.data.files.status == "Success" || resp.data.files.status == "Duplicate") {
                return this.usersService.upadte(req.user.id, { thumb: resp.data.files.thumbnail_url, img: resp.data.files.url });
            }
            throw new common_1.BadRequestException();
        })
            .catch((err) => {
            new common_1.BadGatewayException(err);
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('search/:username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('user-exists/:username/:email'),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userExists", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getInfo", null);
__decorate([
    (0, common_1.Get)('reset-notifications'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetNotifications", null);
__decorate([
    (0, common_1.Get)('user-partners'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userPartners", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('update-img'),
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('img')),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 1000 * 1024 }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadFile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, serialize_interceptor_1.Serialize)(user_dto_1.UserDto),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService])
], UserController);
//# sourceMappingURL=users.controller.js.map