import { Module } from '@nestjs/common';
import { FirebaseCloudMessagingService } from './firebase-cloud-messaging.service';
import { FirebaseCloudMessagingController } from './firebase-cloud-messaging.controller';
import { FirebaseProvider } from 'src/firebase';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseProvider, FirebaseCloudMessagingService],
  controllers: [FirebaseCloudMessagingController],
  exports: [FirebaseCloudMessagingService],
})
export class FirebaseCloudMessagingModule {}
