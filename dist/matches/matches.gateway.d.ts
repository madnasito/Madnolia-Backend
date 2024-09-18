import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Namespace, Socket } from "socket.io";
import { MatchesService } from './matches.service';
import { Users } from 'src/messages/classes/user';
export declare class MatchesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private matchesService;
    private users;
    private readonly logger;
    constructor(matchesService: MatchesService, users: Users);
    io: Namespace;
    handleDisconnect(client: any): void;
    afterInit(server: any): void;
    handleConnection(client: any, ...args: any[]): void;
    handleMatchCreated(client: Socket, payload: string): Promise<void>;
    handleJoinToMatch(client: Socket, payload: string): Promise<void>;
    handleCron(): Promise<void>;
}
