import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseCloudMessagingController } from './firebase-cloud-messaging.controller';

describe('FirebaseCloudMessagingController', () => {
  let controller: FirebaseCloudMessagingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseCloudMessagingController],
    }).compile();

    controller = module.get<FirebaseCloudMessagingController>(
      FirebaseCloudMessagingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
