import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthSerialize } from 'src/common/interceptors/auth.interceptor';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '10d' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_INTERCEPTOR, useClass: Serialize }],
})
export class AuthModule {}
