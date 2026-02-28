import { Injectable, Scope } from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';
import { User } from '../interfaces/user.interface';

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

    const fcmTokenUser = this.getUserByFcmToken(fcmToken);

    if (fcmTokenUser)
      if (userId != fcmTokenUser._id) {
        this.deleteUserFcmToken(fcmToken);
      }

    if (existingUser) {
      const device = existingUser.devices.find((e) => e.fcmToken == fcmToken);

      if (device) {
        device.socketId = socketId;
      } else {
        existingUser.devices.push({
          fcmToken,
          socketId,
          online: true,
          lastActive: new Date(),
        });
      }

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
      devices: [{ fcmToken, socketId, online: true, lastActive: new Date() }],
    });

    return this.users;
  };

  getUserByFcmToken = (fcmToken: string) =>
    this.users.find((user) => user.devices.find((e) => e.fcmToken == fcmToken));

  getUserBySocketId = (id: string) =>
    this.users.find((user) => user.devices.find((e) => e.socketId == id));

  getUserById = (id: Types.ObjectId) =>
    this.users.find((user) => user._id.equals(id));

  getUsersByIds = (ids: Types.ObjectId[]) =>
    this.users.filter((user) => ids.some((id) => user._id.equals(id)));

  getUserByUsername = (username: string) =>
    this.users.find((user) => user.username === username);

  getUserSocketsById(id: Types.ObjectId): string[] {
    const user = this.getUserById(id);
    if (!user) return [];
    return user.devices.map((device) => device.socketId);
  }

  getUsersSockets(ids: Types.ObjectId[]) {
    const users = this.getUsersByIds(ids);

    return users.flatMap((user) =>
      user.devices.map((device) => device.socketId),
    );
  }

  getUserFcmTokensById(id: Types.ObjectId) {
    const user = this.getUserById(id);

    if (!user) return [];

    return user.devices.map((device) => device.fcmToken);
  }

  getUserFcmTokensNoSocketById(id: Types.ObjectId): string[] {
    const user = this.getUserById(id);
    if (!user || user.devices.length == 0) return []; // Handle missing user or devices

    return user.devices
      .filter(
        (device) =>
          device.fcmToken && !device.socketId && device.fcmToken != '',
      )
      .map((device) => device.fcmToken);
  }

  getUsersFcmTokensWithoutSocketById(ids: Types.ObjectId[]): string[] {
    const users = this.getUsersByIds(ids);

    return users.flatMap((user) => this.getUserFcmTokensNoSocketById(user._id));
  }

  getUsers = () => this.users;

  getUsersByRoom = (room: string) =>
    this.users.filter((user) => user.room === room);

  logoutDevice = (socketId: string) => {
    const user = this.getUserBySocketId(socketId);

    if (!user) return;

    user.devices = user.devices.filter((device) => device.socketId != socketId);

    if (user.devices.length == 0) this.deleteUser(user._id);
  };

  deleteUserSocketId = (socketId: string) => {
    const user = this.getUserBySocketId(socketId);
    if (!user) {
      return;
    }

    const device = user.devices.find((device) => device.socketId == socketId);

    if (!device) return;

    device.socketId = '';

    // deleting the element if it empty
    if (device.fcmToken == '' && device.socketId == '')
      user.devices = user.devices.filter(
        (e) => e.fcmToken != '' && e.socketId != '',
      );

    if (user.devices.length === 0) {
      this.deleteUser(user._id);
    }
    return user;
  };

  deleteUserFcmToken = (fcmToken: string) => {
    const user = this.getUserByFcmToken(fcmToken);

    if (!user) {
      return;
    }

    user.devices = user.devices.filter((e) => e.fcmToken != fcmToken);

    if (user.devices.length === 0) this.deleteUser(user._id);

    return user;
  };

  deleteUser = (id: Types.ObjectId) => {
    const deletedUser = this.getUserById(id);

    this.users = this.users.filter((user) => user._id != id);

    return deletedUser;
  };
}
