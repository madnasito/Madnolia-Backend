import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Users } from '../messages/classes/user';

@WebSocketGateway()
export class CallsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly users: Users) {}
  handleConnection(socket: Socket) {
    console.log(`${socket.id} Connected to calls`);
    console.log(this.users.getUsers());
  }

  @SubscribeMessage('make_call')
  handleMakeCall(
    socket: Socket,
    data: { callee_id: string; sdp_offer: string },
  ) {
    const { callee_id, sdp_offer } = data;

    const user = this.users.getUserByUsername(callee_id);

    this.server.to(user.socketId).emit('new_call', {
      caller_id: socket.id,
      sdp_offer: sdp_offer,
    });
  }

  @SubscribeMessage('answer_call')
  handleAnswerCall(
    socket: Socket,
    data: { caller_id: string; sdp_answer: any },
  ) {
    const { caller_id, sdp_answer } = data;

    this.server.to(caller_id).emit('call_answered', {
      callee: socket.id,
      sdpAnswer: sdp_answer,
    });
  }

  @SubscribeMessage('ice_candidate')
  handleIceCandidate(
    socket: Socket,
    data: { calleeId: string; iceCandidate: any },
  ) {
    const { calleeId, iceCandidate } = data;
    const user = this.users.getUserByUsername(calleeId);
    this.server.to(user ? user.socketId : calleeId).emit('ice_candidate', {
      sender: socket.id,
      iceCandidate: iceCandidate,
    });
  }
}
