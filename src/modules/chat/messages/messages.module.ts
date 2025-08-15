import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/messages.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { ConfigService } from '@nestjs/config';
import { FriendshipModule } from 'src/modules/friendship/friendship.module';
import { MatchesModule } from 'src/modules/matches/matches.module';
import {
  MessageRecipient,
  MessageRecipientSchema,
} from './schemas/messages-recipient.schema';
import { FirebaseCloudMessagingModule } from 'src/modules/firebase/firebase-cloud-messaging/firebase-cloud-messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: MessageRecipient.name, schema: MessageRecipientSchema },
    ]),
    UsersModule,
    FriendshipModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '10d' },
        };
      },
    }),
    MatchesModule,
    FirebaseCloudMessagingModule, // Ensure FirebaseCloudMessagingModule is imported
  ],
  providers: [MessagesService, MessagesGateway],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
