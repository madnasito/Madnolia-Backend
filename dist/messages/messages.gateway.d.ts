import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Namespace, Socket } from "socket.io";
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { Users } from './classes/user';
import { JwtService } from '@nestjs/jwt';
export declare class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly messagesService;
    private readonly jwtService;
    private users;
    private readonly logger;
    constructor(messagesService: MessagesService, jwtService: JwtService, users: Users);
    io: Namespace;
    afterInit(socket: Socket): void;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handleDisconnect(client: any): void;
    handleEvent(data: string, client: Socket): string;
    handleMessage(request: any, payload: CreateMessageDto, client: Socket): Promise<void>;
    handleDisconnectChat(client: Socket): boolean;
}
