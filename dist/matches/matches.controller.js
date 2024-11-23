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
const user_guard_1 = require("../guards/user.guard");
const matches_service_1 = require("./matches.service");
const update_match_dto_1 = require("./dtos/update-match.dto");
let MatchesController = class MatchesController {
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    async getMatch(id) {
        return this.matchesService.getMatch(id);
    }
    async getMatchWithGame(id) {
        return this.matchesService.getMatchWithGame(id);
    }
    async getFullMatch(id) {
        return this.matchesService.getFullMatch(id);
    }
    async getPlayerMatches(request) {
        return this.matchesService.getPlayerMatches(request.user.id);
    }
    async getPlayerInvitations(request) {
        return this.matchesService.getPlayerInvitations(request.user.id);
    }
    async getLatestUserGames(request, platform) {
        return this.matchesService.getLatestGamesByUserAndPlatform(request.user.id, parseInt(platform));
    }
    joined(request) {
        return this.matchesService.getMatchesWithUserLiked(request.user.id);
    }
    async getMatchesByPlatform(platform) {
        return this.matchesService.getMatchesByPlatform(parseInt(platform));
    }
    async getMatchesByGameAndPlatform(platform, game) {
        return this.matchesService.getMatchesByGameAndPlatform(parseInt(platform), game);
    }
    async create(req, body) {
        return this.matchesService.create(body, req.user.id);
    }
    update(req, body) {
        return this.matchesService.update(req.user.id, body);
    }
    delete(req, id) {
        return this.matchesService.delete(id, req.user.id);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)('info/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatch", null);
__decorate([
    (0, common_1.Get)('with-game/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatchWithGame", null);
__decorate([
    (0, common_1.Get)('full/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getFullMatch", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('player-matches'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPlayerMatches", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('invitations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getPlayerInvitations", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('latest-games/:platform'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getLatestUserGames", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Get)('joined'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "joined", null);
__decorate([
    (0, common_1.Get)('platform/:platform'),
    __param(0, (0, common_1.Param)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatchesByPlatform", null);
__decorate([
    (0, common_1.Get)('by-platform-and-game/:platform/:game'),
    __param(0, (0, common_1.Param)('platform')),
    __param(1, (0, common_1.Param)('game')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "getMatchesByGameAndPlatform", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_match_dto_1.CreateMatchDto]),
    __metadata("design:returntype", Promise)
], MatchesController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_match_dto_1.UpdateMatchDto]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "delete", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('match'),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map