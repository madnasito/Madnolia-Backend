import { Injectable, Inject, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
  imageUrl?: string;
}

export interface SendNotificationOptions {
  token?: string;
  tokens?: string[];
  topic?: string;
  condition?: string;
}

@Injectable()
export class FCMService {
  private readonly logger = new Logger(FCMService.name);

  constructor(@Inject('FIREBASE_APP') private firebaseApp: admin.app.App) {}

  /**
   * Envía una notificación a un token específico
   */
  async sendToToken(
    token: string,
    payload: NotificationPayload,
  ): Promise<string> {
    if (!this.firebaseApp) {
      throw new Error('Firebase no está inicializado');
    }

    const message: admin.messaging.Message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data || {},
      android: {
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.firebaseApp.messaging().send(message);
      this.logger.log(`Notificación enviada exitosamente: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error enviando notificación: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envía notificaciones a múltiples tokens
   */
  async sendToMultipleTokens(
    tokens: string[],
    payload: NotificationPayload,
  ): Promise<any> {
    if (!this.firebaseApp) {
      throw new Error('Firebase no está inicializado');
    }

    if (tokens.length === 0) {
      throw new Error('No se proporcionaron tokens');
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data || {},
      android: {
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(message);
      this.logger.log(
        `Notificación enviada a ${response.successCount} de ${tokens.length} dispositivos`,
      );
      // Log de tokens que fallaron
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.logger.error(
              `Token falló ${tokens[idx]}: ${resp.error?.message}`,
            );
          }
        });
      }
      return response;
    } catch (error) {
      this.logger.error(`Error enviando notificaciones: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envía una notificación a un tema/topic
   */
  async sendToTopic(
    topic: string,
    payload: NotificationPayload,
  ): Promise<string> {
    if (!this.firebaseApp) {
      throw new Error('Firebase no está inicializado');
    }

    const message: admin.messaging.Message = {
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data || {},
      android: {
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.firebaseApp.messaging().send(message);
      this.logger.log(`Notificación enviada al tema "${topic}": ${response}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Error enviando notificación al tema: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Suscribe tokens a un tema
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.firebaseApp) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const response = await this.firebaseApp
        .messaging()
        .subscribeToTopic(tokens, topic);
      this.logger.log(
        `${response.successCount} tokens suscritos al tema "${topic}"`,
      );

      if (response.failureCount > 0) {
        this.logger.error(
          `${response.failureCount} tokens fallaron al suscribirse`,
        );
      }
    } catch (error) {
      this.logger.error(`Error suscribiendo al tema: ${error.message}`);
      throw error;
    }
  }

  /**
   * Desuscribe tokens de un tema
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.firebaseApp) {
      throw new Error('Firebase no está inicializado');
    }

    try {
      const response = await this.firebaseApp
        .messaging()
        .unsubscribeFromTopic(tokens, topic);
      this.logger.log(
        `${response.successCount} tokens desuscritos del tema "${topic}"`,
      );

      if (response.failureCount > 0) {
        this.logger.error(
          `${response.failureCount} tokens fallaron al desuscribirse`,
        );
      }
    } catch (error) {
      this.logger.error(`Error desuscribiendo del tema: ${error.message}`);
      throw error;
    }
  }

  /**
   * Valida un token FCM
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.firebaseApp.messaging().send(
        {
          token,
          data: { test: 'true' },
        },
        true,
      ); // dry run
      return true;
    } catch (error) {
      this.logger.warn(`Token inválido: ${error.message}`);
      return false;
    }
  }
}
