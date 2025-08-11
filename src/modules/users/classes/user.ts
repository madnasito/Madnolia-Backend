import { Injectable, Scope } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';

@Injectable({ scope: Scope.DEFAULT })
export class Users {
  users: Array<User>;

  constructor(private usersService: UsersService) {
    this.users = [];
  }

  addUser = async (
    userId: Types.ObjectId,
    socketId: string,
    fcmToken: string,
  ) => {
    const existingUser = this.getUserById(userId);

    if (existingUser) {
      existingUser.socketsIds.push(socketId);

      // in case the user not includes the fcmToken
      if (!existingUser.fcmTokens.includes(fcmToken))
        existingUser.fcmTokens.push(fcmToken);

      return this.users;
    }

    const user = await this.usersService.findOneById(userId);

    if (!user) {
      return;
    }

    const { name, username, thumb, _id } = user;

    this.users.push({
      name,
      username,
      thumb,
      _id,
      room: '',
      socketsIds: [socketId],
      fcmTokens: [fcmToken],
    });

    return this.users;
  };

  getUserBySocketId = (id: string) =>
    this.users.find((user) => user.socketsIds.includes(id));

  getUserById = (id: Types.ObjectId) =>
    this.users.find((user) => user._id === id);

  getUsers = () => this.users;

  getUsersByRoom = (room: string) =>
    this.users.filter((user) => user.room === room);

  deleteUserSocketId = (socketId: string) => {
    const user = this.getUserBySocketId(socketId);
    if (!user) {
      return;
    }
    user.socketsIds = user.socketsIds.filter((id) => id !== socketId);

    if (user.socketsIds.length === 0 && user.fcmTokens.length === 0) {
      this.deleteUser(user._id);
    }
    return user;
  };

  deleteUser = (id: Types.ObjectId) => {
    const deletedUser = this.getUserById(id);

    this.users = this.users.filter((user) => user._id != id);

    return deletedUser;
  };
}

interface User {
  name: string;
  username: string;
  thumb: string;
  _id: Types.ObjectId;
  socketsIds: string[];
  fcmTokens: string[];
  room: string;
}
