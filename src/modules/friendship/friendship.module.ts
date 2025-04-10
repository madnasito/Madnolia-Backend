import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Friendship, FriendshipSchema } from './schemas/friendship.schema';

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
})
export class FriendshipModule {}
