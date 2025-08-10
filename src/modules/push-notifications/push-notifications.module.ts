import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FCMService } from '../../services/fcm.service';
import { FirebaseProvider } from '../../firebase';
import { PushNotificationsService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseProvider, FCMService, PushNotificationsService],
  controllers: [PushNotificationsController],
  exports: [FCMService, PushNotificationsService],
})
export class PushNotificationsModule {}
