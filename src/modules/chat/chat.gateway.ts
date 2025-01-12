import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection(socket: any) {
    const callerId = socket.handshake.query.callerId;
    if (callerId) {
      socket.user = callerId; // Almacena el callerId en el socket
      console.log(`${socket.user} Connected`);
      socket.join(socket.user); // Une el socket al room correspondiente
    } else {
      socket.disconnect(); // Desconecta si no hay callerId
    }
  }

  handleDisconnect(socket: any) {
    console.log(`${socket.user} Disconnected`);
  }

  @SubscribeMessage('makeCall')
  handleMakeCall(socket: any, data: any) {
    console.log(data)
    const { calleeId, sdpOffer } = data;
    this.server.to(calleeId).emit('newCall', {
      callerId: socket.user,
      sdpOffer: sdpOffer,
    });
  }

  @SubscribeMessage('answerCall')
  handleAnswerCall(socket: any, data: any) {
    console.log(data)
    const { callerId, sdpAnswer } = data;
    this.server.to(callerId).emit('callAnswered', {
      callee: socket.user,
      sdpAnswer: sdpAnswer,
    });
  }

  @SubscribeMessage('IceCandidate')
  handleIceCandidate(socket: any, data: any) {
    console.log(data)
    const { calleeId, iceCandidate } = data;
    this.server.to(calleeId).emit('IceCandidate', {
      sender: socket.user,
      iceCandidate: iceCandidate,
    });
  }
}
