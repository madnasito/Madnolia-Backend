import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Users } from '../messages/classes/user';
import { Logger, Request, UseGuards } from '@nestjs/common';
import { UserSocketGuard } from 'src/common/guards/user-sockets.guard';

@WebSocketGateway()
export class CallsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly users: Users) {}
  handleConnection(socket: Socket) {
    console.log(`${socket.id} Connected to calls`);
    console.log(this.users.getUsers());
    // const callerId = socket.handshake.query.callerId;
    // if (callerId) {
    //   socket.user = callerId; // Almacena el callerId en el socket
    //   console.log(`${socket.user} Connected`);
    //   socket.join(socket.user); // Une el socket al room correspondiente
    // } else {
    //   socket.disconnect(); // Desconecta si no hay callerId
    // }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('make_call')
  async makeCall(
    @Request() request: any,
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log(request.user);
      console.table(payload);
      console.log(client.id);

      const calleeId = payload.calleeId;
      const sdpOffer = payload.sdpOffer;

      const user = this.users.getUser(client.id);

      console.log(calleeId);
      console.table(Object.getOwnPropertyNames(calleeId));

      client.to(calleeId).emit('new_call', {
        callerId: user._id,
        sdpOffer,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('answer_call')
  answerCall(
    @Request() request: any,
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const callerId = payload.callerId;
      const sdpAnswer = payload.sdpAnswer;

      const user = this.users.getUser(client.id);

      client.to(callerId).emit('call_answered', {
        caller: user._id,
        sdpAnswer,
      });
    } catch (error) {
      Logger.error(error);
    }
  }

  @UseGuards(UserSocketGuard)
  @SubscribeMessage('ice_candidate')
  iceCandidate(
    @Request() request: any,
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const callerId = payload.callerId;
      const iceCandidate = payload.ice_candidate;
      const user = this.users.getUser(client.id);

      console.log(`Data from client ${client.id} on IceCandidate:`);
      console.table(payload);

      console.log(`Emitting payload to client ${client.id}:`);
      console.table({
        sender: user._id,
        iceCandidate: iceCandidate,
      });

      client.to(callerId).emit('ice_candidate', {
        sender: user._id,
        iceCandidate: iceCandidate,
      });
    } catch (error) {
      Logger.error(error);
    }
  }
}
