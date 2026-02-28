import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Users } from '../../users/classes/user';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class CallsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  connectedUsers: { [userId: string]: string[] } = {}; // Map user IDs to their connected room IDs

  constructor(private readonly users: Users) {}

  handleConnection(socket: Socket) {
    console.log(`${socket.id} Connected to calls`);
    console.log(this.users.getUsers());
  }

  @SubscribeMessage('join_call_room')
  async handleJoinRoom(client: Socket, payload: { callRoom: string }) {
    try {
      await client.join(payload.callRoom);
      this.addUserToRoom(payload.callRoom, client.id);
      const user = this.users.getUserBySocketId(client.id);

      if (!user) throw new Error('User not found');
      Logger.debug(`Client ${user.username} joined room ${payload.callRoom}`);
    } catch (error) {
      Logger.error('Error joining call room', error);
      throw error;
    }
  }

  @SubscribeMessage('leave_call_room')
  async handleLeaveRoom(client: Socket, roomId: string) {
    try {
      await client.leave(roomId);
      this.removeUserFromRoom(roomId, client.id);
      const user = this.users.getUserBySocketId(client.id);

      if (!user) throw new Error('User not found');
      Logger.debug(`Client ${user.username} left room ${roomId}`);
    } catch (error) {
      Logger.error('Error leaving call room', error);
      throw error;
    }
  }

  @SubscribeMessage('make_room_call')
  handleMakeRoomCall(
    client: Socket,
    data: { calleeId: string; sdpOffer: any },
  ) {
    const { calleeId, sdpOffer } = data;
    const calleeRooms = this.connectedUsers[calleeId] || [];

    // Send offer to all connected rooms of the callee
    for (const roomId in calleeRooms) {
      client
        .to(roomId)
        .emit('new_room_call', { calleeId: client.id, sdpOffer });
    }
  }

  @SubscribeMessage('answer_room_call')
  handleAnswerRoomCall(
    client: Socket,
    data: { callerId: string; sdpAnswer: any },
  ) {
    const { callerId, sdpAnswer } = data;
    const callerRooms = this.connectedUsers[callerId] || [];

    // Send answer to all connected rooms to the caller
    for (const roomId of callerRooms) {
      client
        .to(roomId)
        .emit('room_call_answered', { callee: client.id, sdpAnswer });
    }
  }

  @SubscribeMessage('room_ice_candidate')
  handleRoomIceCandidate(
    client: Socket,
    data: { calleeId: string; iceCandidate: any },
  ) {
    const { calleeId, iceCandidate } = data;
    const calleeRooms = this.connectedUsers[calleeId] || [];

    // Send ice candidate to all connected rooms of the callee
    for (const roomId of calleeRooms) {
      client
        .to(roomId)
        .emit('room_ice_candidate', { sender: client.id, iceCandidate });
    }
  }

  @SubscribeMessage('make_call')
  handleMakeCall(
    socket: Socket,
    data: { callee_id: string; sdp_offer: string },
  ) {
    const { callee_id, sdp_offer } = data;

    const user = this.users.getUserByUsername(callee_id);

    if (!user) throw new Error('User not found');

    user.devices.forEach((device) => {
      this.server.to(device.socketId).emit('new_call', {
        caller_id: socket.id,
        sdp_offer: sdp_offer,
      });
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
    if (user && user.devices) {
      user.devices.forEach((device) => {
        this.server.to(device.socketId).emit('ice_candidate', {
          sender: socket.id,
          iceCandidate: iceCandidate,
        });
      });
    } else {
      this.server.to(calleeId).emit('ice_candidate', {
        sender: socket.id,
        iceCandidate: iceCandidate,
      });
    }
  }

  private addUserToRoom(roomId: string, userId: string) {
    if (!this.connectedUsers[userId]) {
      this.connectedUsers[userId] = [];
    }
    this.connectedUsers[userId].push(roomId);
  }

  private removeUserFromRoom(roomId: string, userId: string) {
    const userRooms = this.connectedUsers[userId] || [];
    const index = userRooms.indexOf(roomId);
    if (index !== -1) {
      userRooms.splice(index, 1);
    }
  }
}
