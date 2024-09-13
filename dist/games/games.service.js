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
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const game_schema_1 = require("./schemas/game.schema");
const mongoose_2 = require("mongoose");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
let GamesService = class GamesService {
    constructor(gameModel, config, httpService) {
        this.gameModel = gameModel;
        this.config = config;
        this.httpService = httpService;
        this.getGame = async (id) => {
            const gameDb = await this.findById(id);
            if (gameDb)
                return gameDb;
            const rawGame = await this.getRawgGame(id);
            const newGame = {
                name: rawGame.name,
                slug: rawGame.slug,
                gameId: rawGame.id,
                platforms: [],
                background: rawGame.background_image,
                screenshots: [],
                description: rawGame.description_raw
            };
            const createdGame = new this.gameModel(newGame);
            return await createdGame.save();
        };
        this.findById = async (gameId) => await this.gameModel.findOne({ gameId });
        this.getRawgGame = async (id) => {
            const apiKey = this.config.get('RAWG_API_KEY');
            const gameData = (await this.httpService.axiosRef.get(`/${id}?key=${apiKey}`)).data;
            return gameData;
        };
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(game_schema_1.Game.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService,
        axios_1.HttpService])
], GamesService);
//# sourceMappingURL=games.service.js.map