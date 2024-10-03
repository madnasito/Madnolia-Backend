import { WsException } from "@nestjs/websockets";
export declare class CreateMessageDto extends WsException {
    room: string;
    text: string;
}
