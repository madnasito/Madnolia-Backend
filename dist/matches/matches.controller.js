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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const create_match_dto_1 = require("./dtos/create-match.dto");
const games_service_1 = require("../games/games.service");
let MatchesController = class MatchesController {
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    async create(body) {
        const gameData = await this.gamesService.getGame(body.game);
        console.log(gameData.name);
        return gameData;
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_match_dto_1.CreateMatchDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "create", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('match'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map