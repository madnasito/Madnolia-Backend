/**
 * Ejemplos de cómo usar el servicio de notificaciones push FCM
 * en tu aplicación Madnolia
 */

import { Injectable } from '@nestjs/common';
import { PushNotificationsService } from '../modules/push-notifications/push-notifications.service';

@Injectable()
export class FCMUsageExamples {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  /**
   * Ejemplo 1: Enviar notificación cuando se encuentra un partido
   * Este método se llamaría desde tu servicio de matches
   */
  async onMatchFound(matchData: {
    players: Array<{ id: string; fcmToken?: string; name: string }>;
    gameId: string;
    gameName: string;
    matchId: string;
  }) {
    // Filtrar usuarios que tienen token FCM
    const usersWithTokens = matchData.players.filter(
      (player) => player.fcmToken,
    );

    if (usersWithTokens.length === 0) return;

    // Enviar notificación a cada jugador sobre su oponente
    for (const player of usersWithTokens) {
      const opponent = matchData.players.find((p) => p.id !== player.id);
      
      if (opponent && player.fcmToken) {
        await this.pushNotificationsService.sendMatchFoundNotification(
          [player.fcmToken],
          {
            opponentName: opponent.name,
            gameName: matchData.gameName,
            matchId: matchData.matchId,
          },
        );
      }
    }
  }

  /**
   * Ejemplo 2: Recordatorio de torneo próximo
   * Este método se ejecutaría con un cron job
   */
  async sendTournamentReminders(tournamentData: {
    id: string;
    name: string;
    startTime: string;
    participants: Array<{ id: string; fcmToken?: string }>;
  }) {
    const tokens = tournamentData.participants
      .filter((p) => p.fcmToken)
      .map((p) => p.fcmToken!);

    if (tokens.length === 0) return;

    await this.pushNotificationsService.sendTournamentReminderNotification(
      tokens,
      {
        name: tournamentData.name,
        startTime: tournamentData.startTime,
        tournamentId: tournamentData.id,
      },
    );
  }

  /**
   * Ejemplo 3: Notificación de nuevo mensaje en chat
   * Este método se llamaría desde tu servicio de mensajes
   */
  async onNewMessage(messageData: {
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientFcmToken?: string;
    message: string;
    chatId: string;
  }) {
    if (!messageData.recipientFcmToken) return;

    await this.pushNotificationsService.sendMessageNotification(
      messageData.recipientFcmToken,
      {
        senderName: messageData.senderName,
        message: messageData.message,
        chatId: messageData.chatId,
        senderId: messageData.senderId,
      },
    );
  }

  /**
   * Ejemplo 4: Notificación de solicitud de amistad
   * Este método se llamaría desde tu servicio de friendship
   */
  async onFriendRequestSent(requestData: {
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientFcmToken?: string;
  }) {
    if (!requestData.recipientFcmToken) return;

    await this.pushNotificationsService.sendFriendRequestNotification(
      requestData.recipientFcmToken,
      {
        name: requestData.senderName,
        userId: requestData.senderId,
      },
    );
  }

  /**
   * Ejemplo 5: Suscribir usuario a temas cuando se registra
   */
  async onUserRegistered(userData: {
    id: string;
    fcmToken?: string;
    preferredGames: string[];
  }) {
    if (!userData.fcmToken) return;

    // Suscribir a temas generales
    const generalTopics = ['announcements', 'news'];
    
    // Suscribir a temas de juegos preferidos
    const gameTopics = userData.preferredGames.map(
      (game) => `game_${game.toLowerCase()}`,
    );

    const allTopics = [...generalTopics, ...gameTopics];

    await this.pushNotificationsService.subscribeUserToTopics(
      userData.fcmToken,
      allTopics,
    );
  }

  /**
   * Ejemplo 6: Enviar notificación a tema específico
   * Útil para anuncios generales o actualizaciones
   */
  async sendAnnouncementToTopic(announcement: {
    title: string;
    message: string;
    topic: string;
    imageUrl?: string;
  }) {
    await this.pushNotificationsService.sendCustomNotification(
      { topic: announcement.topic },
      {
        title: announcement.title,
        body: announcement.message,
        imageUrl: announcement.imageUrl,
        data: {
          type: 'announcement',
          topic: announcement.topic,
        },
      },
    );
  }
}

/**
 * Cómo integrar en tus servicios existentes:
 * 
 * 1. En tu servicio de matches:
 * ```typescript
 * @Injectable()
 * export class MatchesService {
 *   constructor(
 *     private readonly pushNotificationsService: PushNotificationsService,
 *   ) {}
 * 
 *   async createMatch(matchData) {
 *     // ... lógica de crear match
 *     
 *     // Enviar notificación
 *     await this.pushNotificationsService.sendMatchFoundNotification(...);
 *   }
 * }
 * ```
 * 
 * 2. En tu servicio de usuarios, agregar campo FCM token:
 * ```typescript
 * // users.schema.ts
 * @Schema()
 * export class User {
 *   // ... otros campos
 * 
 *   @Prop()
 *   fcmToken?: string;
 * 
 *   @Prop({ type: [String] })
 *   subscribedTopics?: string[];
 * }
 * ```
 * 
 * 3. Endpoint para actualizar token FCM:
 * ```typescript
 * @Put('fcm-token')
 * async updateFCMToken(@User() user, @Body() { token }) {
 *   await this.usersService.updateFCMToken(user.id, token);
 *   return { success: true };
 * }
 * ```
 */
