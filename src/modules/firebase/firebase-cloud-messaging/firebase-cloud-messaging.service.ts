import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendNotificationDto } from '../dtos/send-notification.dto';
import {
  Message,
  MulticastMessage,
} from 'firebase-admin/lib/messaging/messaging-api';
import { app } from 'firebase-admin';

@Injectable()
export class FirebaseCloudMessagingService {
  private readonly logger = new Logger(FirebaseCloudMessagingService.name);
  constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {}

  async sendNotification(payload: SendNotificationDto) {
    try {
      if (!this.firebaseApp) throw new Error('FIREBASE_NOT_INITIALIZED');

      const message: Message = {
        notification: {
          title: payload.title,
          body: payload.body,
          imageUrl: payload.imageUrl,
        },
        data: payload.data,
        token: payload.token, // Add this line to specify the target device
      };

      const response = await this.firebaseApp.messaging().send(message);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw new Error('FCM_ERROR');
    }
  }

  async sendToMultipleTokens(payload: SendNotificationDto) {
    try {
      if (!this.firebaseApp) throw new Error('FIREBASE_NOT_INITIALIZED');

      if (!payload.tokens || payload.tokens.length === 0)
        throw Error('FCM_NO_TOKENS');

      // Do not use notification to avoid display notification handled by FCM lib
      const message: MulticastMessage = {
        tokens: payload.tokens, // Use tokens for multiple devices
        // notification: {
        //   title: payload.title,
        //   body: payload.body,
        //   imageUrl: payload.imageUrl,
        // },
        data: payload.data || {},
      };

      const response = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(message);

      // Log de tokens que fallaron
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.logger.error(
              `Token falló ${payload.tokens[idx]}: ${resp.error?.message}`,
            );
          }
        });
      }
      return response;
    } catch (error) {
      this.logger.error(error);
      throw Error('FCM_ERROR');
    }
  }

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
      this.logger.warn(`Invalid token: ${error.message}`);
      return false;
    }
  }
}
