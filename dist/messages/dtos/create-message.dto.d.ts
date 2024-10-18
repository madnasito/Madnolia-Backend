import { WsException } from "@nestjs/websockets";
export declare class CreateMessageDto extends WsException {
    to: string;
    text: string;
}
