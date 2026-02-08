import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionRequestService } from './connection-request.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConnectionRequest } from './schemas/connection-request.schema';
import { ConnectionRequestStatus } from './enums/connection-status.enum';
import { FriendshipService } from 'src/modules/friendship/friendship.service';
import { Types } from 'mongoose';

describe('ConnectionRequestService', () => {
  let service: ConnectionRequestService;
  let model: any;

  const mockConnectionRequestModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockFriendshipService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionRequestService,
        {
          provide: getModelToken(ConnectionRequest.name),
          useValue: mockConnectionRequestModel,
        },
        {
          provide: FriendshipService,
          useValue: mockFriendshipService,
        },
      ],
    }).compile();

    service = module.get<ConnectionRequestService>(ConnectionRequestService);
    model = module.get(getModelToken(ConnectionRequest.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const senderId = new Types.ObjectId();
    const receiverId = new Types.ObjectId();

    it('should return existing request if direct match and pending', async () => {
      const existing = {
        sender: senderId,
        receiver: receiverId,
        status: ConnectionRequestStatus.PENDING,
      };
      model.findOne.mockResolvedValue(existing);

      const result = await service.create(senderId, receiverId);
      expect(result).toBe(existing);
      expect(model.findOne).toHaveBeenCalled();
    });

    it('should return existing request if inverted match and pending', async () => {
      // Correcting the mock to work with the service's logic
      const existingMock = {
        sender: { toString: () => receiverId.toString() },
        receiver: { toString: () => senderId.toString() },
        status: ConnectionRequestStatus.PENDING,
      };
      model.findOne.mockResolvedValue(existingMock);

      const result = await service.create(senderId, receiverId);
      expect(result).toBe(existingMock);
    });

    it('should swap sender/receiver if inverted match and rejected', async () => {
      const existingRecord = {
        sender: receiverId,
        receiver: senderId,
        status: ConnectionRequestStatus.REJECTED,
        save: jest.fn().mockResolvedValue(this),
      };
      model.findOne.mockResolvedValue(existingRecord);

      await service.create(senderId, receiverId);

      expect(existingRecord.sender).toBe(senderId);
      expect(existingRecord.receiver).toBe(receiverId);
      expect(existingRecord.status).toBe(ConnectionRequestStatus.PENDING);
      expect(existingRecord.save).toHaveBeenCalled();
    });
  });
});
