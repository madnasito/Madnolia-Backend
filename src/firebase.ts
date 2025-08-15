import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';
import { existsSync } from 'fs';
import * as path from 'path';

export const FirebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    try {
      // Ruta del archivo de credenciales
      const serviceAccountPath = path.join(
        process.cwd(),
        'firebase-service-account.json',
      );

      // Verificar si existe el archivo de credenciales
      if (existsSync(serviceAccountPath)) {
        console.log(
          '✅ Usando archivo de credenciales Firebase:',
          serviceAccountPath,
        );
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      }

      // Si no existe el archivo, usar variables de entorno
      const projectId = configService.get<string>('FIREBASE_PROJECT_ID');
      const privateKey = configService.get<string>('FIREBASE_PRIVATE_KEY');
      const clientEmail = configService.get<string>('FIREBASE_CLIENT_EMAIL');

      if (projectId && privateKey && clientEmail) {
        console.log('✅ Usando variables de entorno para Firebase');
        const serviceAccount: ServiceAccount = {
          projectId,
          privateKey: privateKey.replace(/\\n/g, '\n'),
          clientEmail,
        };

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      }

      console.warn('⚠️  No se encontraron credenciales de Firebase');
      return null;
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error.message);
      return null;
    }
  },
};
// export const firebaseApp: App = app.length
//   ? app[0]
//   : initializeApp({
//       credential: credential.cert(serviceAccount),
//     });
