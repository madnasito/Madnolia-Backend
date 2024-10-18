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
var MessagesGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_sockets_guard_1 = require("../guards/user-sockets.guard");
const user_guard_1 = require("../guards/user.guard");
const messages_service_1 = require("./messages.service");
const create_message_dto_1 = require("./dtos/create-message.dto");
const user_1 = require("./classes/user");
const jwt_1 = require("@nestjs/jwt");
let MessagesGateway = MessagesGateway_1 = class MessagesGateway {
    constructor(messagesService, jwtService, users) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.users = users;
        this.logger = new common_1.Logger(MessagesGateway_1.name);
    }
    afterInit(socket) {
        this.logger.log("Initialized");
    }
    async handleConnection(client, ...args) {
        try {
            const { size } = this.io.sockets;
            const { token } = client.handshake.headers;
            if (token === undefined || token === null) {
                client.disconnect(true);
                throw new websockets_1.WsException('Missing authentication token');
            }
            const tokenPayload = await this.jwtService.verifyAsync(token);
            await this.users.addUser(tokenPayload.id, client.id);
            this.logger.debug(`Client id: ${client.id} connected`);
            this.logger.debug(`Number of connected clients: ${size}`);
        }
        catch (error) {
            return new websockets_1.WsException(error);
        }
    }
    handleDisconnect(client) {
        this.users.deleteUser(client.id);
        this.logger.debug(`Cliend id:${client.id} disconnected`);
    }
    handleEvent(data, client) {
        try {
            this.users.getUser(client.id).room = data;
            client.join(data);
            return true;
        }
        catch (error) {
            throw new websockets_1.WsException(error);
        }
    }
    async handleMessage(request, payload, client) {
        try {
            this.logger.log(`Message received from client id: ${client.id}`);
            this.logger.debug(`Payload: ${payload}`);
            const message = {
                room: payload.room,
                user: request.user,
                text: payload.text
            };
            const messageSaved = await this.messagesService.create(message);
            if (!messageSaved)
                throw new websockets_1.WsException("No message");
            const { text, _id, date } = messageSaved;
            const user = this.users.getUserById(request.user);
            const payloadEvent = {
                _id,
                text,
                date,
                room: payload.room,
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    thumb: user.thumb
                }
            };
            this.logger.debug(`${this.users.getUser(client.id).room}`);
            client.to(payload.room).emit('message', payloadEvent);
            client.emit('message', payloadEvent);
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException(error);
        }
    }
    handleDisconnectChat(client) {
        try {
            this.logger.debug(`Leaved the room: ${client.id}`);
            this.users.getUser(client.id).room = "";
            return true;
        }
        catch (error) {
            console.log(error);
            throw new websockets_1.WsException(error);
        }
    }
};
exports.MessagesGateway = MessagesGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Namespace)
], MessagesGateway.prototype, "io", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "afterInit", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleConnection", null);
__decorate([
    (0, common_1.UseGuards)(user_sockets_guard_1.UserSocketGuard),
    (0, websockets_1.SubscribeMessage)('init_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleEvent", null);
__decorate([
    (0, common_1.UseGuards)(user_sockets_guard_1.UserSocketGuard),
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __param(2, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessagesGateway.prototype, "handleMessage", null);
__decorate([
    (0, common_1.UseGuards)(user_sockets_guard_1.UserSocketGuard),
    (0, websockets_1.SubscribeMessage)('disconnect_chat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], MessagesGateway.prototype, "handleDisconnectChat", null);
exports.MessagesGateway = MessagesGateway = MessagesGateway_1 = __decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    (0, websockets_1.WebSocketGateway)({}),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
        jwt_1.JwtService,
        user_1.Users])
], MessagesGateway);
//# sourceMappingURL=messages.gateway.js.map