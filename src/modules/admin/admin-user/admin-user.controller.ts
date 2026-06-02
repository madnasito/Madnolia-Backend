import { Body, Controller, Post } from '@nestjs/common';
import { AdminUserService } from './services/admin-user.service';
import { AdminLoginDto } from './dtos/admin-login.dto';

@Controller('admin-user')
export class AdminUserController {
    constructor(private readonly adminUserService: AdminUserService) { }

    @Post('login')
    login(@Body() body: AdminLoginDto) {
        return this.adminUserService.login(body);
    }
}
