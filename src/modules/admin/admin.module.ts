import { Module } from '@nestjs/common';
import { AdminRolesModule } from './admin-roles/admin-roles.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [
    AdminRolesModule,
    AdminUserModule
  ],
})
export class AdminModule { }
