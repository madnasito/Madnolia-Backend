import {
  Controller,
  Get,
  UseGuards,
  Request,
  Delete,
  Query,
} from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { NotificationsService } from './notifications.service';
import { Types } from 'mongoose';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UseGuards(UserGuard)
  @Get('')
  getNotifications(
    @Request() request: any,
    @Query('from') cursor: string | null,
  ) {
    return this.notificationsService.getUserNotifications(
      request.user.id,
      cursor,
    );
  }

  @UseGuards(UserGuard)
  @Get('unread-count')
  getUnreadNotificationsCount(@Request() request: any) {
    return this.notificationsService.getUserUnreadNotificationsCount(
      request.user.id,
    );
  }

  @UseGuards(UserGuard)
  @Delete('delete')
  deleteNotification(@Request() request: any, @Query('id') id: Types.ObjectId) {
    return this.notificationsService.deleteUserNotification(
      request.user.id,
      id,
    );
  }
}
