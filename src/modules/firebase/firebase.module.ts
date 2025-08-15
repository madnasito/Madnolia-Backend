import { Module } from '@nestjs/common';
import { FirebaseCloudMessagingModule } from './firebase-cloud-messaging/firebase-cloud-messaging.module';

@Module({
  imports: [FirebaseCloudMessagingModule],
  exports: [FirebaseCloudMessagingModule],
})
export class FirebaseModule {}
