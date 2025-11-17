import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserGuard } from 'src/common/guards/user.guard';
import { FriendshipService } from './friendship.service';
import { MultipleMongoIdsDto } from 'src/common/dto/mutiple-mongo-ids.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}
  @Get('with')
  @UseGuards(UserGuard)
  async getFriendshipByUser(
    @Request() req: any,
    @Query('user') user: Types.ObjectId,
  ) {
    const friendshipDb = await this.friendshipService.findFriendshipByUsers(
      req.user.id,
      user,
    );
    if (!friendshipDb) throw new NotFoundException();
    return friendshipDb;
  }

  @Get('get')
  @UseGuards(UserGuard)
  async getFriendshipById(
    @Request() req: any,
    @Query('id') id: Types.ObjectId,
  ) {
    const friendshipDb = await this.friendshipService.fincFriendshipById(id);
    if (!friendshipDb) throw new NotFoundException();

    if (friendshipDb.user1 != req.user.id && friendshipDb.user2 != req.user.id)
      throw new NotFoundException();

    return friendshipDb;
  }

  @Post('friendships-by-users')
  @UseGuards(UserGuard)
  async getFriendshipsByUsers(
    @Request() req: any,
    @Body() body: MultipleMongoIdsDto,
  ) {
    return this.friendshipService.findFriendshipsByUsers(req.user.id, body.ids);
  }

  @Post('friendships-by-ids')
  @UseGuards(UserGuard)
  async getFriendshipsByIds(
    @Request() req: any,
    @Body() body: MultipleMongoIdsDto,
  ) {
    return this.friendshipService.findFriendshipsByIds(req.user.id, body.ids);
  }
}
