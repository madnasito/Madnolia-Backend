import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Friendship, FriendshipSchema } from './schemas/friendship.schema';
import { FriendshipController } from './friendship.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Friendship.name,
        schema: FriendshipSchema,
      },
    ]),
  ],
  providers: [FriendshipService],
  exports: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
