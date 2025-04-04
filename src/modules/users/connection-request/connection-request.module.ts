import { Module } from '@nestjs/common';
import {
  ConnectionRequest,
  ConnectionRequestSchema,
} from './schemas/connection-request.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionRequestService } from './connection-request.service';
import { NotificationsModule } from 'src/modules/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forFeature([
      { name: ConnectionRequest.name, schema: ConnectionRequestSchema },
    ]),
  ],
  providers: [ConnectionRequestService],
  exports: [ConnectionRequestService],
})
export class ConnectionRequestModule {}
