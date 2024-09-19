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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const bcrypt_1 = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.signUp = async (signUpDto) => {
            const emailDb = await this.findOneByEmail(signUpDto.email);
            if (emailDb) {
                throw new common_1.BadRequestException('Email in use');
            }
            const userDb = await this.fincOneByUsername(signUpDto.username);
            if (userDb) {
                throw new common_1.BadRequestException('Username in use');
            }
            const createdUser = new this.userModel(signUpDto);
            const saltOrRounds = 10;
            const password = signUpDto.password;
            const hash = await (0, bcrypt_1.hash)(password, saltOrRounds);
            const salt = await (0, bcrypt_1.genSalt)();
            console.log(salt);
            createdUser.password = hash;
            await createdUser.save();
            const payload = { user: createdUser._id };
            const token = await this.jwtService.signAsync(payload);
            return {
                user: createdUser,
                token
            };
        };
        this.signIn = async (signInDto) => {
            const user = await this.fincOneByUsername(signInDto.username);
            if (!user)
                throw new common_1.NotFoundException('Not found user');
            const isMatch = await (0, bcrypt_1.compare)(signInDto.password, user.password);
            if (!isMatch)
                throw new common_1.BadRequestException("Wrong password");
            const payload = { id: user._id };
            const token = await this.jwtService.signAsync(payload);
            return {
                user,
                token
            };
        };
        this.fincOneByUsername = async (username) => {
            const user = await this.userModel.findOne({ username });
            return user;
        };
        this.findOneByEmail = async (email) => {
            const user = await this.userModel.findOne({ email });
            return user;
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map