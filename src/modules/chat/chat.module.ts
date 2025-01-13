import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [MessagesModule, CallsModule],
  providers: [],
})
export class ChatModule {}
