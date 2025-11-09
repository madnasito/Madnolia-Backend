import { Test, TestingModule } from '@nestjs/testing';
import { UsersGateway } from './users.gateway';
import { UsersService } from './users.service';
import { ConnectionRequestService } from './connection-request/connection-request.service';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from '../friendship/friendship.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Users } from './classes/user';
import { WsException } from '@nestjs/websockets';

describe('UsersGateway', () => {
  let gateway: UsersGateway;
  let users: Users;

  const mockUsersService = {
    handleUserDisconnection: jest.fn(),
  };

  const mockConnectionRequestService = {};
  const mockJwtService = {};
  const mockFriendshipService = {};
  const mockNotificationsService = {};
  const mockUsers = {
    getUserBySocketId: jest.fn(),
    deleteUserSocketId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersGateway,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConnectionRequestService,
          useValue: mockConnectionRequestService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: FriendshipService,
          useValue: mockFriendshipService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: Users,
          useValue: mockUsers,
        },
      ],
    }).compile();

    gateway = module.get<UsersGateway>(UsersGateway);
    users = module.get<Users>(Users);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleDisconnect', () => {
    it('should not throw an error if user is not found', async () => {
      const client = { id: 'some-socket-id' };
      (users.getUserBySocketId as jest.Mock).mockReturnValue(undefined);

      await expect(gateway.handleDisconnect(client)).resolves.not.toThrow();
    });

    it('should call handleUserDisconnection if user is found', async () => {
      const client = { id: 'some-socket-id' };
      const user = { _id: 'some-user-id' };
      (users.getUserBySocketId as jest.Mock).mockReturnValue(user);

      await gateway.handleDisconnect(client);

      expect(mockUsersService.handleUserDisconnection).toHaveBeenCalledWith(
        user._id,
        client.id,
      );
    });

    it('should throw a WsException if an error occurs', async () => {
      const client = { id: 'some-socket-id' };
      const user = { _id: 'some-user-id' };
      (users.getUserBySocketId as jest.Mock).mockReturnValue(user);
      mockUsersService.handleUserDisconnection.mockRejectedValue(new Error('Some error'));

      await expect(gateway.handleDisconnect(client)).rejects.toThrow(
        new WsException('ERROR_HANDLING_DISCONNECTION'),
      );
    });
  });
});