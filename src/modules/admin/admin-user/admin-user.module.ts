import { Global, Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminUser, AdminUserSchema } from './schemas/admin-user.schema';
import { AdminUserService } from './services/admin-user.service';
import { AdminUserInitializerService } from './services/admin-user-initializer.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminUserController } from './admin-user.controller';

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([{ name: AdminUser.name, schema: AdminUserSchema }]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>('JWT_ADMIN_SECRET'),
                    signOptions: { expiresIn: '7d' },
                };
            },
        }),
    ],
    controllers: [AdminUserController],
    providers: [AdminUserService, AdminUserInitializerService]
})
export class AdminUserModule { }
