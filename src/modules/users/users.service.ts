import mongoose, { Model, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { compare, hashSync } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import axios from 'axios';
import { SignUpDto } from '../auth/dtos/sign-up.dtio';
// import { ConnectionRequestStatus } from './connection-request/enums/connection-status.enum';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { ConnectionStatus } from './enums/connection-status.enum';
import { FriendshipService } from '../friendship/friendship.service';
import { FriendshipStatus } from '../friendship/enums/friendship-status.enum';
import { Friendship } from '../friendship/schemas/friendship.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Availability } from './enums/availability.enum';
// import { SimpleUser } from './classes/simple-user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly connectionRequestService: ConnectionRequestService,
    private readonly frienshipService: FriendshipService,
  ) {}

  findByFcmToken = async (fcmToken: string) => {
    return this.userModel.findOne({ 'devices.fcmToken': fcmToken });
  };

  handleUserConnection = async (userId: Types.ObjectId, fcmToken: string) => {
    const userByFcmToken = await this.findByFcmToken(fcmToken);

    if (userByFcmToken && !userByFcmToken._id.equals(userId)) {
      userByFcmToken.devices = userByFcmToken.devices.filter(
        (device) => device.fcmToken !== fcmToken,
      );
      await userByFcmToken.save();
    }

    const user = await this.findOneById(userId);

    const device = user.devices.find((device) => device.fcmToken === fcmToken);

    if (device) {
      device.online = true;
    } else {
      user.devices.push({
        fcmToken,
        online: true,
        lastActive: new Date(),
        socketId: '',
      });
    }
    await user.save();
  };

  handleUserDisconnection = async (
    userId: Types.ObjectId,
    socketId: string,
  ) => {
    return await this.userModel.updateOne(
      { _id: userId, 'devices.socketId': socketId },
      {
        $set: {
          'devices.$.socketId': '',
          'devices.$.online': false,
          'devices.$.lastActive': new Date(),
        },
      },
    );
  };

  create = async (signUpDto: SignUpDto): Promise<User> => {
    const emailDb = await this.findOneByEmail(signUpDto.email);

    if (emailDb) {
      throw new BadRequestException('EMAIL_IN_USE');
    }

    signUpDto.username = signUpDto.username.toLowerCase().trim();
    const userDb = await this.fincOneByUsername(signUpDto.username);
    if (userDb) {
      throw new BadRequestException('USERNAME_IN_USE');
    }

    const createdUser = new this.userModel(signUpDto);
    const saltOrRounds = 10;
    const password = signUpDto.password;
    const hash = hashSync(password, saltOrRounds);

    createdUser.password = hash;

    await createdUser.save();

    // Use toJSON method to convert _id to string
    return createdUser.toJSON();
  };

  fincOneByUsername = async (username: string) => {
    username = username.toLowerCase().trim();
    const user = await this.userModel.findOne({ username });
    return user;
  };

  findOneByEmail = async (email: string): Promise<User | null> => {
    const user = await this.userModel.findOne({ email });
    return user;
  };

  findOneById = async (id: Types.ObjectId) => {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return user;
  };

  fincOneMinimalById = async (id: Types.ObjectId) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new NotFoundException('USER_NOT_FOUND');

    const user = await this.userModel.findById(id, {
      _id: 1,
      name: 1,
      username: 1,
      thumb: 1,
    });

    if (!user) throw new NotFoundException('USER_NOT_FOUND');

    return user;
  };

  getInfo = async (user: Types.ObjectId) =>
    (await this.userModel.findOne({ _id: user, status: true })).toJSON();

  getUserInfo = async (
    targetUserId: Types.ObjectId,
    currentUserId: Types.ObjectId,
  ) => {
    // Obtener información del usuario objetivo
    const targetUser = await this.userModel.findOne({
      _id: targetUserId,
      status: true,
    });
    if (!targetUser) {
      throw new Error('User not found');
    }

    // Verificar si son amigos
    const friendship = await this.frienshipService.findFriendshipByUsers(
      currentUserId,
      targetUserId,
    );

    // Obtener solicitudes de conexión entre los usuarios
    const connectionRequests =
      await this.connectionRequestService.findRequestsByUser(targetUserId);

    // Determinar el estado de la conexión
    let connectionStatus = ConnectionStatus.NONE;

    if (friendship && friendship.status === FriendshipStatus.ALIVE) {
      connectionStatus = ConnectionStatus.PARTNER;
    } else {
      // Verificar solicitudes de conexión
      const requestSent = connectionRequests.some(
        (request) =>
          request.sender.equals(currentUserId) &&
          request.receiver.equals(targetUserId),
      );

      const requestReceived = connectionRequests.some(
        (request) =>
          request.sender.equals(targetUserId) &&
          request.receiver.equals(currentUserId),
      );

      if (requestSent) {
        connectionStatus = ConnectionStatus.REQUEST_SENT;
      } else if (requestReceived) {
        connectionStatus = ConnectionStatus.REQUEST_RECEIVED;
      }
    }

    return {
      _id: targetUser._id,
      name: targetUser.name,
      username: targetUser.username,
      thumb: targetUser.thumb,
      image: targetUser.image,
      connection: connectionStatus,
    };
  };

  getMultipleUsersInfo = async (users: Types.ObjectId[]) => {
    const usersInfo = await this.userModel
      .find({ _id: { $in: users } })
      .select({ name: 1, username: 1, _id: 1, thumb: 1, image: 1 })
      .lean()
      .exec();

    return usersInfo;
  };

  // getInvitations = async (user: string) => this.userModel.populate('')

  // En tu UsersService
  async update(userId: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (user.email != updateData.email && updateData.email) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 15); // Restar 15 días
      if (user.emailModifiedAt && dateLimit < user.emailModifiedAt) {
        throw new ConflictException('EMAIL_DATE_LIMIT');
      }
      const emailDb = await this.findOneByEmail(updateData.email);
      if (emailDb) throw new ConflictException('EMAIL_IN_USE');

      user.emailModifiedAt = new Date();
    }
    // 3. Actualizar y retornar el documento
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            ...updateData,
            modifiedAt: new Date(),
            emailModifiedAt: user.emailModifiedAt,
          },
        },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return updatedUser;
  }

  updateAvailability = async (
    userId: Types.ObjectId,
    availability: Availability,
  ) => {
    return this.userModel.findByIdAndUpdate(
      userId,
      { availability, modifiedAt: new Date() },
      { new: true },
    );
  };

  userExists = async (username: string, email: string) => {
    const usernameDb = await this.userModel.findOne({ username });
    if (usernameDb) throw new ConflictException('USERNAME_IN_USE');
    const emailDb = await this.userModel.findOne({ email });
    if (emailDb) throw new ConflictException('EMAIL_IN_USE');
    return {};
  };

  async searchUser(
    userId: Types.ObjectId,
    query: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<any> {
    const regex = new RegExp(query, 'i');
    const skip = (page - 1) * limit;

    const userInfo = await this.userModel.findOne({ _id: userId });

    const partners = (
      await this.frienshipService.findFriendshipsByUser(userId)
    ).map((e: Friendship) => (e.user1 != userInfo.id ? e.user1 : e.user2));

    const userRequests =
      await this.connectionRequestService.findRequestsByUser(userId);

    const requestsReceived = userRequests
      .filter((request) => request.receiver.equals(userInfo._id))
      .map((request) => request.sender);

    const requestsSended = userRequests
      .filter((request) => request.sender.equals(userInfo._id))
      .map((request) => request.receiver);

    const foundUsers = await this.userModel
      .find({
        $or: [{ username: regex }, { name: regex }],
        $nor: [{ _id: userId }],
        status: true,
      })
      .select({ name: 1, username: 1, _id: 1, thumb: 1, image: 1 })
      .lean()
      .skip(skip)
      .limit(limit)
      .exec();

    const results = foundUsers.map((foundUser) => {
      const connectionUser: any = foundUser;
      connectionUser.connection = ConnectionStatus.NONE;

      if (
        partners.some((partnerId: Types.ObjectId) => partnerId == foundUser._id)
      ) {
        connectionUser.connection = ConnectionStatus.PARTNER;
      } else if (
        requestsSended.some((senderId: Types.ObjectId) =>
          senderId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_SENT;
      } else if (
        requestsReceived.some((receiverId: Types.ObjectId) =>
          receiverId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_RECEIVED;
      }

      return connectionUser;
    });

    // Ordenar los resultados: partners primero
    results.sort((a, b) => {
      if (
        a.connection === ConnectionStatus.PARTNER &&
        b.connection !== ConnectionStatus.PARTNER
      ) {
        return -1; // 'a' va antes que 'b'
      } else if (
        a.connection !== ConnectionStatus.PARTNER &&
        b.connection === ConnectionStatus.PARTNER
      ) {
        return 1; // 'b' va antes que 'a'
      }
      return 0; // Mantener el orden relativo si ambos tienen el mismo estado
    });

    // Aplicar paginación después de ordenar
    return results.slice(skip, skip + limit);
  }

  async searchToInviteUser(
    userId: Types.ObjectId,
    query: string,
    page: number = 1,
    limit: number = 5,
  ): Promise<any> {
    const regex = new RegExp(query, 'i');
    const skip = (page - 1) * limit;

    const userInfo = await this.userModel.findOne({ _id: userId });

    const partners = (
      await this.frienshipService.findFriendshipsByUser(userId)
    ).map((e: Friendship) => (e.user1 != userInfo.id ? e.user1 : e.user2));

    const userRequests =
      await this.connectionRequestService.findRequestsByUser(userId);

    const requestsReceived = userRequests
      .filter((request) => request.receiver.equals(userInfo._id))
      .map((request) => request.sender);

    const requestsSended = userRequests
      .filter((request) => request.sender.equals(userInfo._id))
      .map((request) => request.receiver);

    const foundUsers = await this.userModel
      .find({
        $or: [{ username: regex }, { name: regex }],
        $nor: [{ _id: userId }],
        status: true,
      })
      .select({ name: 1, username: 1, _id: 1, thumb: 1 })
      .lean()
      .skip(skip)
      .limit(limit)
      .exec();

    const results = foundUsers.map((foundUser) => {
      const connectionUser: any = foundUser;
      connectionUser.connection = ConnectionStatus.NONE;

      if (
        partners.some((partnerId: Types.ObjectId) => partnerId == foundUser._id)
      ) {
        connectionUser.connection = ConnectionStatus.PARTNER;
      } else if (
        requestsSended.some((senderId: Types.ObjectId) =>
          senderId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_SENT;
      } else if (
        requestsReceived.some((receiverId: Types.ObjectId) =>
          receiverId.equals(foundUser._id),
        )
      ) {
        connectionUser.connection = ConnectionStatus.REQUEST_RECEIVED;
      }

      return connectionUser;
    });

    // Ordenar los resultados: partners primero
    results.sort((a, b) => {
      if (
        a.connection === ConnectionStatus.PARTNER &&
        b.connection !== ConnectionStatus.PARTNER
      ) {
        return -1; // 'a' va antes que 'b'
      } else if (
        a.connection !== ConnectionStatus.PARTNER &&
        b.connection === ConnectionStatus.PARTNER
      ) {
        return 1; // 'b' va antes que 'a'
      }
      return 0; // Mantener el orden relativo si ambos tienen el mismo estado
    });

    // Aplicar paginación después de ordenar
    return results.slice(skip, skip + limit);
  }

  resetNotifications = async (user: string) =>
    this.userModel.findOneAndUpdate(
      { _id: user },
      { notification: 0 },
      { new: true },
    );

  requestConnection = async (user: Types.ObjectId, partner: Types.ObjectId) => {
    try {
      const verifiedUser = await this.getInfo(user);
      const verifiedPartner = await this.getInfo(partner);

      if (!verifiedUser || !verifiedPartner)
        throw new NotFoundException('USER_NOT_FOUND');

      await this.userModel.findOneAndUpdate(
        { _id: partner },
        { $push: { connectionsRequests: user } },
      );
      return true;
    } catch (error) {
      Logger.error(error);
      throw new NotAcceptableException(error);
    }
  };

  removePartner = async (user: Types.ObjectId, partner: Types.ObjectId) => {
    try {
      const friendshipDb = await this.frienshipService.findFriendshipByUsers(
        user,
        partner,
      );

      return this.frienshipService.updateStatusById(
        friendshipDb.id,
        FriendshipStatus.BROKE,
      );
    } catch (error) {
      Logger.error(error);
      throw new NotAcceptableException(error);
    }
  };

  uploadImage = async (form: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
      axios
        .post('https://beeimg.com/api/upload/file/json/', form, {
          headers: {},
        })
        .then((resp) => resolve(resp))
        .catch((err) => reject(err));
    });
  };

  verifyPassword = async (id: Types.ObjectId, password: string) => {
    const user = await this.userModel.findById(id);

    if (!user) throw new NotFoundException();

    const isMatch = await compare(password, user.password);

    if (!isMatch) throw new BadRequestException('WRONG_PASSWORD');

    return true;
  };

  async updatePassword(password: string, id: Types.ObjectId) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const saltRounds = 10;
    const hash = hashSync(password, saltRounds);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          password: hash,
          modifiedAt: new Date(),
        },
        { new: true, runValidators: true }, // Retorna el documento actualizado y valida
      )
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} could not be updated`);
    }

    return updatedUser;
  }
  delete = async (user: Types.ObjectId) =>
    this.userModel.findByIdAndDelete(user);
}
