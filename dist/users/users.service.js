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
exports.UsersService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.fincOneByUsername = async (username) => {
            const user = await this.userModel.findOne({ username });
            return user;
        };
        this.findOneByEmail = async (email) => {
            const user = await this.userModel.findOne({ email });
            return user;
        };
        this.fincOneById = async (id) => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id))
                throw new common_1.NotFoundException();
            const user = await this.userModel.findById(id);
            if (!user)
                throw new common_1.NotFoundException();
            return user;
        };
        this.getInfo = async (user) => await this.userModel.findOne({ _id: user, status: true });
        this.upadte = async (user, attrs) => this.userModel.findOneAndUpdate({ _id: user }, attrs, { new: true });
        this.searchUser = async (username) => {
            let regex = new RegExp(username, 'i');
            return await this.userModel.find({ username: regex, status: true }, { name: 1, username: 1, _id: 1, imgThumb: 1 }, { limit: 5 });
        };
        this.resetNotifications = async (user) => this.userModel.findOneAndUpdate({ _id: user }, { notification: 0 }, { new: true });
        this.getUserPartners = async (user) => {
            return this.userModel
                .findOne({ _id: user }, { partners: 1 }, {
                populate: {
                    path: 'partners',
                    match: { status: true },
                    select: 'name username img',
                },
            })
                .select('partners');
        };
        this.addPartner = async (user, partner) => {
            const verifiedUser = await this.getInfo(partner);
            if (!verifiedUser)
                throw new common_1.NotFoundException();
            return this.userModel.findOneAndUpdate({ _id: user }, { $push: { partners: partner } }, { new: true });
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map