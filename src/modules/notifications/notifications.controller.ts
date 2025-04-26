import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UseGuards(UserGuard)
  @Get('')
  getNotifications(@Request() request: any) {
    return this.notificationsService.getUserNotifications(request.user.id);
  }

  @UseGuards(UserGuard)
  @Get('unread-count')
  getUnreadNotificationsCount(@Request() request: any) {
    return this.notificationsService.getUserUnreadNotificationsCount(
      request.user.id,
    );
  }
}
