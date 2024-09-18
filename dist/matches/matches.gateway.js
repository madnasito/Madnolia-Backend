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
exports.MatchesGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_sockets_guard_1 = require("../guards/user-sockets.guard");
const matches_service_1 = require("./matches.service");
const user_1 = require("../messages/classes/user");
let MatchesGateway = class MatchesGateway {
    constructor(matchesService, users) {
        this.matchesService = matchesService;
        this.users = users;
    }
    handleDisconnect(client) {
        console.log("Connection");
    }
    afterInit(server) {
    }
    handleConnection(client, ...args) {
        console.log("ANDIFAD ");
    }
    async handleMatchCreated(client, payload) {
        const match = await (await this.matchesService.getMatch(payload)).populate({ path: 'game' });
        if (!match)
            throw new websockets_1.WsException('Not found match');
        console.log(match.game.background);
        const matchUrl = `${process.env.URL}/match/info/${match._id}`;
        console.log(process.env);
        const eventPayload = {
            match: match._id,
            img: match.game.background,
            name: match.title,
            url: matchUrl
        };
        match.inviteds.forEach(element => {
            const invitedUser = this.users.getUserById(element.toString());
            if (invitedUser) {
                client.to(invitedUser.socketId).emit('invitation', eventPayload);
            }
        });
    }
    async handleJoinToMatch(client, payload) {
        try {
            const user = this.users.getUser(client.id);
            const matchUpdated = await this.matchesService.addUserToMatch(payload, user._id);
            if (!matchUpdated) {
                client.emit('added_to_match', false);
                throw new websockets_1.WsException(common_1.NotFoundException);
            }
            client.emit('added_to_match', true);
            const { _id, name, imgThumb, username } = user;
            client.to(payload).emit('new_player_to_match', {
                _id, name, imgThumb, username
            });
        }
        catch (error) {
            client.emit('added_to_match', false);
            throw new websockets_1.WsException(error);
        }
    }
};
exports.MatchesGateway = MatchesGateway;
__decorate([
    (0, common_1.UseGuards)(user_sockets_guard_1.UserSocketGuard),
    (0, websockets_1.SubscribeMessage)('match_created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], MatchesGateway.prototype, "handleMatchCreated", null);
__decorate([
    (0, common_1.UseGuards)(user_sockets_guard_1.UserSocketGuard),
    (0, websockets_1.SubscribeMessage)('join_to_match'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], MatchesGateway.prototype, "handleJoinToMatch", null);
exports.MatchesGateway = MatchesGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [matches_service_1.MatchesService,
        user_1.Users])
], MatchesGateway);
//# sourceMappingURL=matches.gateway.js.map