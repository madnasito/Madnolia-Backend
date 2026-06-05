import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';

@Injectable()
export class AdminUserInitializerService implements OnModuleInit {
    private readonly logger = new Logger(AdminUserInitializerService.name);

    constructor(private readonly adminUserService: AdminUserService) { }

    async onModuleInit() {
        await this.adminUserService.createDefaultAdmin();
    }
}
