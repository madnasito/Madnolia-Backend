import { Test, TestingModule } from '@nestjs/testing';
import { AdminUserInitializerService } from './admin-user-initializer.service';

describe('AdminUserInitializerService', () => {
  let service: AdminUserInitializerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUserInitializerService],
    }).compile();

    service = module.get<AdminUserInitializerService>(AdminUserInitializerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
