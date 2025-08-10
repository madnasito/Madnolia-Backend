import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { FCMService, NotificationPayload } from '../../services/fcm.service';
import { SendNotificationDto } from './dtos/send-notification.dto';

export class SubscribeToTopicDto {
  tokens: string[];
  topic: string;
}

export class ValidateTokenDto {
  token: string;
}

@Controller('push-notifications')
export class PushNotificationsController {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly fcmService: FCMService,
  ) {}

  /**
   * Endpoint para enviar notificación personalizada
   */
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Body() dto: SendNotificationDto) {
    const payload: NotificationPayload = {
      title: dto.title,
      body: dto.body,
      data: dto.data,
      imageUrl: dto.imageUrl,
    };

    console.table(dto);
    if (dto.token) {
      // Enviar a un solo token
      const messageId = await this.fcmService.sendToToken(dto.token, payload);
      console.log(messageId);
      return {
        success: true,
        message: 'Notificación enviada exitosamente',
        messageId,
      };
    } else if (dto.tokens && dto.tokens.length > 0) {
      // Enviar a múltiples tokens
      const response = await this.fcmService.sendToMultipleTokens(
        dto.tokens,
        payload,
      );
      return {
        success: true,
        message: 'Notificaciones enviadas',
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      };
    } else if (dto.topic) {
      // Enviar a un tema
      const messageId = await this.fcmService.sendToTopic(dto.topic, payload);
      return {
        success: true,
        message: 'Notificación enviada al tema',
        messageId,
      };
    }

    throw new Error('Debe proporcionar al menos un token o tema');
  }

  /**
   * Endpoint para suscribir tokens a un tema
   */
  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribeToTopic(@Body() dto: SubscribeToTopicDto) {
    await this.fcmService.subscribeToTopic(dto.tokens, dto.topic);
    return {
      success: true,
      message: `Tokens suscritos al tema ${dto.topic}`,
    };
  }

  /**
   * Endpoint para desuscribir tokens de un tema
   */
  @Post('unsubscribe')
  @HttpCode(HttpStatus.OK)
  async unsubscribeFromTopic(@Body() dto: SubscribeToTopicDto) {
    await this.fcmService.unsubscribeFromTopic(dto.tokens, dto.topic);
    return {
      success: true,
      message: `Tokens desuscritos del tema ${dto.topic}`,
    };
  }

  /**
   * Endpoint para validar un token FCM
   */
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() dto: ValidateTokenDto) {
    const isValid = await this.fcmService.validateToken(dto.token);
    return {
      success: true,
      isValid,
      message: isValid ? 'Token válido' : 'Token inválido',
    };
  }

  /**
   * Endpoints específicos de la aplicación
   */

  @Post('match-found')
  @HttpCode(HttpStatus.OK)
  async sendMatchFoundNotification(
    @Body()
    dto: {
      userTokens: string[];
      opponentName: string;
      gameName: string;
      matchId: string;
    },
  ) {
    await this.pushNotificationsService.sendMatchFoundNotification(
      dto.userTokens,
      {
        opponentName: dto.opponentName,
        gameName: dto.gameName,
        matchId: dto.matchId,
      },
    );

    return {
      success: true,
      message: 'Notificación de partido encontrado enviada',
    };
  }

  @Post('tournament-reminder')
  @HttpCode(HttpStatus.OK)
  async sendTournamentReminder(
    @Body()
    dto: {
      userTokens: string[];
      tournamentName: string;
      startTime: string;
      tournamentId: string;
    },
  ) {
    await this.pushNotificationsService.sendTournamentReminderNotification(
      dto.userTokens,
      {
        name: dto.tournamentName,
        startTime: dto.startTime,
        tournamentId: dto.tournamentId,
      },
    );

    return {
      success: true,
      message: 'Recordatorio de torneo enviado',
    };
  }

  @Post('friend-request')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequestNotification(
    @Body()
    dto: {
      userToken: string;
      senderName: string;
      senderId: string;
    },
  ) {
    await this.pushNotificationsService.sendFriendRequestNotification(
      dto.userToken,
      {
        name: dto.senderName,
        userId: dto.senderId,
      },
    );

    return {
      success: true,
      message: 'Notificación de solicitud de amistad enviada',
    };
  }

  @Post('message')
  @HttpCode(HttpStatus.OK)
  async sendMessageNotification(
    @Body()
    dto: {
      userToken: string;
      senderName: string;
      message: string;
      chatId: string;
      senderId: string;
    },
  ) {
    await this.pushNotificationsService.sendMessageNotification(dto.userToken, {
      senderName: dto.senderName,
      message: dto.message,
      chatId: dto.chatId,
      senderId: dto.senderId,
    });

    return {
      success: true,
      message: 'Notificación de mensaje enviada',
    };
  }
}
