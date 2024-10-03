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
exports.GameSchema = exports.Game = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Game = class Game {
};
exports.Game = Game;
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], Game.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", String)
], Game.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        unique: true
    }),
    __metadata("design:type", Number)
], Game.prototype, "gameId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    __metadata("design:type", Array)
], Game.prototype, "platforms", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", String)
], Game.prototype, "background", void 0);
__decorate([
    (0, mongoose_1.Prop)({}),
    __metadata("design:type", Array)
], Game.prototype, "screenshots", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: ""
    }),
    __metadata("design:type", String)
], Game.prototype, "description", void 0);
exports.Game = Game = __decorate([
    (0, mongoose_1.Schema)()
], Game);
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(Game);
//# sourceMappingURL=game.schema.js.map