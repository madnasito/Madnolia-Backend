import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from './messages/messages.module';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [MessagesModule, CallsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
