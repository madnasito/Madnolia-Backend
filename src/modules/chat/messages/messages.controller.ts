import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  Body,
  Post,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { UserGuard } from 'src/common/guards/user.guard';
import { UserChatDto } from './dtos/user-chat-messages.dto';

import { SyncMessagesDto } from './dtos/sync-messages.dto';
// import { Types } from 'mongoose';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('sync-from')
  @UseGuards(UserGuard)
  async syncMessages(
    @Request() req: any,
    @Query() syncMessagesDto: SyncMessagesDto,
  ) {
    return this.messagesService.syncMessages(req.user.id, syncMessagesDto);
  }

  @Get('')
  @UseGuards(UserGuard)
  async getChats(@Request() req: any, @Query('skip') skip: number) {
    // return false;
    return this.messagesService.getUserChats(req.user.id, skip);
  }

  @Get('match')
  async getMatchMessages(
    @Query('match') id: string,
    @Query('cursor') cursor: string,
  ) {
    return this.messagesService.getRoomMessages(id, cursor);
  }

  @Post('chat')
  @UseGuards(UserGuard)
  async getChatMessages(@Request() req: any, @Body() body: UserChatDto) {
    return this.messagesService.getUserChatMessages(
      req.user.id,
      body.conversation,
      body.cursor,
    );
  }
}
