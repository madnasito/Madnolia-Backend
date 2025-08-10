import { Injectable, Logger } from '@nestjs/common';
import { FCMService, NotificationPayload } from '../../services/fcm.service';

export interface NotificationTemplate {
  match_found: {
    title: string;
    body: string;
  };
  tournament_reminder: {
    title: string;
    body: string;
  };
  friend_request: {
    title: string;
    body: string;
  };
  message_received: {
    title: string;
    body: string;
  };
}

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(private readonly fcmService: FCMService) {}

  /**
   * Envía notificación de partido encontrado
   */
  async sendMatchFoundNotification(
    userTokens: string[],
    matchData: {
      opponentName: string;
      gameName: string;
      matchId: string;
    },
  ): Promise<void> {
    const payload: NotificationPayload = {
      title: '🎮 ¡Partido encontrado!',
      body: `Te enfrentarás a ${matchData.opponentName} en ${matchData.gameName}`,
      data: {
        type: 'match_found',
        matchId: matchData.matchId,
        opponentName: matchData.opponentName,
        gameName: matchData.gameName,
      },
    };

    try {
      await this.fcmService.sendToMultipleTokens(userTokens, payload);
      this.logger.log(
        `Notificación de partido enviada a ${userTokens.length} usuarios`,
      );
    } catch (error) {
      this.logger.error('Error enviando notificación de partido:', error);
    }
  }

  /**
   * Envía notificación de recordatorio de torneo
   */
  async sendTournamentReminderNotification(
    userTokens: string[],
    tournamentData: {
      name: string;
      startTime: string;
      tournamentId: string;
    },
  ): Promise<void> {
    const payload: NotificationPayload = {
      title: '🏆 Recordatorio de Torneo',
      body: `El torneo "${tournamentData.name}" comienza en 30 minutos`,
      data: {
        type: 'tournament_reminder',
        tournamentId: tournamentData.tournamentId,
        tournamentName: tournamentData.name,
        startTime: tournamentData.startTime,
      },
    };

    try {
      await this.fcmService.sendToMultipleTokens(userTokens, payload);
      this.logger.log(
        `Recordatorio de torneo enviado a ${userTokens.length} usuarios`,
      );
    } catch (error) {
      this.logger.error('Error enviando recordatorio de torneo:', error);
    }
  }

  /**
   * Envía notificación de solicitud de amistad
   */
  async sendFriendRequestNotification(
    userToken: string,
    senderData: {
      name: string;
      userId: string;
    },
  ): Promise<void> {
    const payload: NotificationPayload = {
      title: '👥 Nueva solicitud de amistad',
      body: `${senderData.name} te ha enviado una solicitud de amistad`,
      data: {
        type: 'friend_request',
        senderId: senderData.userId,
        senderName: senderData.name,
      },
    };

    try {
      await this.fcmService.sendToToken(userToken, payload);
      this.logger.log(`Notificación de solicitud de amistad enviada`);
    } catch (error) {
      this.logger.error('Error enviando notificación de solicitud:', error);
    }
  }

  /**
   * Envía notificación de mensaje recibido
   */
  async sendMessageNotification(
    userToken: string,
    messageData: {
      senderName: string;
      message: string;
      chatId: string;
      senderId: string;
    },
  ): Promise<void> {
    const payload: NotificationPayload = {
      title: `💬 Mensaje de ${messageData.senderName}`,
      body: messageData.message,
      data: {
        type: 'message_received',
        chatId: messageData.chatId,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
      },
    };

    try {
      await this.fcmService.sendToToken(userToken, payload);
      this.logger.log(`Notificación de mensaje enviada`);
    } catch (error) {
      this.logger.error('Error enviando notificación de mensaje:', error);
    }
  }

  /**
   * Suscribe un usuario a notificaciones por tema
   */
  async subscribeUserToTopics(
    userToken: string,
    topics: string[],
  ): Promise<void> {
    try {
      for (const topic of topics) {
        await this.fcmService.subscribeToTopic([userToken], topic);
      }
      this.logger.log(`Usuario suscrito a topics: ${topics.join(', ')}`);
    } catch (error) {
      this.logger.error('Error suscribiendo usuario a topics:', error);
    }
  }

  /**
   * Desuscribe un usuario de notificaciones por tema
   */
  async unsubscribeUserFromTopics(
    userToken: string,
    topics: string[],
  ): Promise<void> {
    try {
      for (const topic of topics) {
        await this.fcmService.unsubscribeFromTopic([userToken], topic);
      }
      this.logger.log(`Usuario desuscrito de topics: ${topics.join(', ')}`);
    } catch (error) {
      this.logger.error('Error desuscribiendo usuario de topics:', error);
    }
  }

  /**
   * Envía notificación personalizada
   */
  async sendCustomNotification(
    targets: string | string[] | { topic: string },
    payload: NotificationPayload,
  ): Promise<void> {
    try {
      if (typeof targets === 'string') {
        // Un solo token
        await this.fcmService.sendToToken(targets, payload);
      } else if (Array.isArray(targets)) {
        // Múltiples tokens
        await this.fcmService.sendToMultipleTokens(targets, payload);
      } else if ('topic' in targets) {
        // Enviar a tema
        await this.fcmService.sendToTopic(targets.topic, payload);
      }

      this.logger.log('Notificación personalizada enviada');
    } catch (error) {
      this.logger.error('Error enviando notificación personalizada:', error);
    }
  }

  /**
   * Valida si un token FCM es válido
   */
  async isTokenValid(token: string): Promise<boolean> {
    return this.fcmService.validateToken(token);
  }
}
