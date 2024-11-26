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
exports.MatchSchema = exports.Match = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const game_schema_1 = require("../../games/schemas/game.schema");
const group_schema_1 = require("../../groups/schema/group.schema");
const user_schema_1 = require("../../users/schemas/user.schema");
const status_enum_1 = require("../enums/status.enum");
let Match = class Match {
};
exports.Match = Match;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Game',
        required: true,
    }),
    __metadata("design:type", game_schema_1.Game)
], Match.prototype, "game", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", Number)
], Match.prototype, "platform", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    __metadata("design:type", Number)
], Match.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }),
    __metadata("design:type", user_schema_1.User)
], Match.prototype, "user", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'Group',
    }),
    __metadata("design:type", group_schema_1.Group)
], Match.prototype, "group", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        type: [mongoose_2.default.Schema.Types.ObjectId],
    }),
    __metadata("design:type", Array)
], Match.prototype, "inviteds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'Casual',
        maxlength: 25,
    }),
    __metadata("design:type", String)
], Match.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 60,
        max: 99,
        min: 5,
    }),
    __metadata("design:type", Number)
], Match.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [mongoose_2.default.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    }),
    __metadata("design:type", Array)
], Match.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Match.prototype, "private", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: false,
    }),
    __metadata("design:type", Boolean)
], Match.prototype, "tournament", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: status_enum_1.MatchStatus,
        default: status_enum_1.MatchStatus.WAITING,
    }),
    __metadata("design:type", Number)
], Match.prototype, "status", void 0);
exports.Match = Match = __decorate([
    (0, mongoose_1.Schema)()
], Match);
exports.MatchSchema = mongoose_1.SchemaFactory.createForClass(Match);
//# sourceMappingURL=match.schema.js.map