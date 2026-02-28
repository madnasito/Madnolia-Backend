import { Inject, Injectable, Logger } from '@nestjs/common';
import { SendNotificationDto } from '../dtos/send-notification.dto';
import { messaging, app } from 'firebase-admin';
// import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class FirebaseCloudMessagingService {
  private readonly logger = new Logger(FirebaseCloudMessagingService.name);
  constructor(
    @Inject('FIREBASE_APP') private firebaseApp: app.App,
    // private readonly usersService: UsersService,
  ) {}

  async sendToMultipleTokens(payload: SendNotificationDto) {
    try {
      if (!this.firebaseApp) throw new Error('FIREBASE_NOT_INITIALIZED');

      if (!payload.tokens || payload.tokens.length === 0)
        throw Error('FCM_NO_TOKENS');

      // Do not use notification to avoid display notification handled by FCM lib
      const message: messaging.MulticastMessage = {
        tokens: payload.tokens, // Use tokens for multiple devices
        // notification: {
        //   title: payload.title,
        //   body: payload.body,
        //   imageUrl: payload.imageUrl,
        // },
        data: payload.data || {},
        android: {
          priority: 'high',
          data: payload.data || {},
          directBootOk: true,
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
      };

      const response = await this.firebaseApp
        .messaging()
        .sendEachForMulticast(message);

      // Log de tokens que fallaron
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const failedToken = payload.tokens[idx];
            // const errorCode = resp.error?.code;
            this.logger.error(
              `Token falló ${failedToken}: ${resp.error?.message}`,
            );

            // if (errorCode === 'messaging/registration-token-not-registered') {
            //   this.logger.error(`Borrando token invalido: ${failedToken}`);
            //   // this.usersService.removeFcmToken(failedToken);
            // }
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
      this.logger.error(`Invalid token: ${error.message}`);
      return false;
    }
  }
}
