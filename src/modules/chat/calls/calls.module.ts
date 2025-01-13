import { Module } from '@nestjs/common';
import { CallsGateway } from './calls.gateway';
import { CallsService } from './calls.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  providers: [CallsGateway, CallsService],
  imports: [MessagesModule],
})
export class CallsModule {}
