# 🔔 Sistema de Notificaciones Push con Firebase Cloud Messaging

Este documento describe cómo usar el sistema de notificaciones push implementado en Madnolia Backend.

## 📋 Índice

- [Configuración](#configuración)
- [Estructura del Sistema](#estructura-del-sistema)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Integración en la App Cliente](#integración-en-la-app-cliente)
- [Variables de Entorno](#variables-de-entorno)

## 🔧 Configuración

### 1. Archivo de Credenciales Firebase

El sistema busca automáticamente el archivo `firebase-service-account.json` en la raíz del proyecto. Este archivo contiene las credenciales necesarias para autenticarse con Firebase.

### 2. Variables de Entorno (Alternativa)

Si no tienes el archivo de credenciales, puedes usar variables de entorno:

```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
```

## 🏗️ Estructura del Sistema

```
src/
├── services/
│   └── fcm.service.ts              # Servicio base de FCM
├── modules/push-notifications/
│   ├── push-notifications.module.ts    # Módulo de notificaciones
│   ├── push-notifications.service.ts   # Servicio de alto nivel
│   └── push-notifications.controller.ts # Endpoints REST
├── firebase.ts                     # Configuración Firebase
└── examples/
    └── fcm-usage-examples.ts       # Ejemplos de integración
```

## 🚀 Endpoints Disponibles

### Notificación General

```http
POST /push-notifications/send
Content-Type: application/json

{
  "token": "FCM_TOKEN",           // Para un solo usuario
  "tokens": ["TOKEN1", "TOKEN2"], // Para múltiples usuarios
  "topic": "news",                // Para un tema
  "title": "Título de notificación",
  "body": "Cuerpo del mensaje",
  "data": {                       // Datos adicionales (opcional)
    "key": "value"
  },
  "imageUrl": "https://..."       // Imagen (opcional)
}
```

### Notificaciones Específicas de la App

#### 🎮 Partido Encontrado
```http
POST /push-notifications/match-found
{
  "userTokens": ["token1", "token2"],
  "opponentName": "Juan",
  "gameName": "FIFA 24",
  "matchId": "match123"
}
```

#### 🏆 Recordatorio de Torneo
```http
POST /push-notifications/tournament-reminder
{
  "userTokens": ["token1", "token2"],
  "tournamentName": "Copa de Verano",
  "startTime": "2024-08-10T15:00:00Z",
  "tournamentId": "tournament123"
}
```

#### 👥 Solicitud de Amistad
```http
POST /push-notifications/friend-request
{
  "userToken": "user_token",
  "senderName": "María",
  "senderId": "user456"
}
```

#### 💬 Nuevo Mensaje
```http
POST /push-notifications/message
{
  "userToken": "user_token",
  "senderName": "Carlos",
  "message": "¡Hola! ¿Jugamos?",
  "chatId": "chat789",
  "senderId": "user123"
}
```

### Gestión de Temas

#### Suscribir a Tema
```http
POST /push-notifications/subscribe
{
  "tokens": ["token1", "token2"],
  "topic": "fifa24_updates"
}
```

#### Desuscribir de Tema
```http
POST /push-notifications/unsubscribe
{
  "tokens": ["token1", "token2"],
  "topic": "fifa24_updates"
}
```

### Validación de Token
```http
POST /push-notifications/validate-token
{
  "token": "FCM_TOKEN_A_VALIDAR"
}
```

## 💡 Ejemplos de Uso en Servicios

### En tu Servicio de Matches

```typescript
@Injectable()
export class MatchesService {
  constructor(
    private readonly pushNotificationsService: PushNotificationsService,
  ) {}

  async createMatch(player1Id: string, player2Id: string, gameId: string) {
    // Crear el match en la base de datos
    const match = await this.matchRepository.create({
      player1: player1Id,
      player2: player2Id,
      game: gameId,
    });

    // Obtener información de los jugadores
    const [player1, player2, game] = await Promise.all([
      this.usersService.findById(player1Id),
      this.usersService.findById(player2Id),
      this.gamesService.findById(gameId),
    ]);

    // Enviar notificaciones push
    const tokens = [player1.fcmToken, player2.fcmToken].filter(Boolean);
    
    if (tokens.length > 0) {
      await this.pushNotificationsService.sendMatchFoundNotification(
        tokens,
        {
          opponentName: player1Id === player1.id ? player2.name : player1.name,
          gameName: game.name,
          matchId: match.id,
        },
      );
    }

    return match;
  }
}
```

### En tu Servicio de Usuarios

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateFCMToken(userId: string, fcmToken: string) {
    return this.userRepository.findByIdAndUpdate(userId, {
      fcmToken,
      fcmTokenUpdatedAt: new Date(),
    });
  }

  async subscribeToGameTopics(userId: string, gameIds: string[]) {
    const user = await this.userRepository.findById(userId);
    
    if (!user.fcmToken) {
      throw new Error('Usuario no tiene token FCM');
    }

    const topics = gameIds.map(gameId => `game_${gameId}`);
    
    await this.pushNotificationsService.subscribeUserToTopics(
      user.fcmToken,
      topics,
    );
  }
}
```

## 📱 Integración en la App Cliente

### Android (React Native)

```typescript
import messaging from '@react-native-firebase/messaging';

// Obtener token FCM
const getFCMToken = async () => {
  const token = await messaging().getToken();
  
  // Enviar token al backend
  await api.put('/users/fcm-token', { token });
};

// Escuchar notificaciones
messaging().onMessage(async remoteMessage => {
  console.log('Notificación recibida:', remoteMessage);
  
  // Mostrar notificación local o actualizar UI
  if (remoteMessage.data?.type === 'match_found') {
    // Navegar a la pantalla del match
    navigation.navigate('Match', { matchId: remoteMessage.data.matchId });
  }
});

// Manejar tap en notificación (app cerrada)
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('App abierta por notificación:', remoteMessage);
  
  // Navegar según el tipo de notificación
  handleNotificationNavigation(remoteMessage);
});
```

### iOS (React Native)

```typescript
import messaging from '@react-native-firebase/messaging';
import { request, PERMISSIONS } from 'react-native-permissions';

// Solicitar permisos
const requestNotificationPermission = async () => {
  const permission = await request(PERMISSIONS.IOS.NOTIFICATIONS);
  
  if (permission === 'granted') {
    const token = await messaging().getToken();
    await api.put('/users/fcm-token', { token });
  }
};
```

## 🏷️ Temas Sugeridos

- `announcements`: Anuncios generales
- `news`: Noticias de la app
- `game_{gameId}`: Actualizaciones de juego específico
- `tournaments`: Recordatorios de torneos
- `maintenance`: Notificaciones de mantenimiento

## 🔍 Monitoreo y Logs

El sistema incluye logging detallado:

- ✅ Notificaciones enviadas exitosamente
- ❌ Errores de envío
- 📊 Estadísticas de entrega
- 🚨 Tokens inválidos

Los logs se pueden encontrar en la consola con el prefijo `[FCMService]` o `[PushNotificationsService]`.

## 🛠️ Solución de Problemas

### Token FCM Inválido
```
Error: Registration token(s) provided to sendToDevice() must be a non-empty string or a non-empty array.
```
**Solución**: Verificar que el token no esté vacío o sea null.

### Credenciales Firebase Incorrectas
```
Error: Failed to parse private key: Error: Invalid PEM formatted message.
```
**Solución**: Verificar que el archivo de credenciales esté bien formateado y las variables de entorno sean correctas.

### App No Recibe Notificaciones
1. Verificar que el token FCM esté actualizado en el backend
2. Comprobar permisos de notificaciones en el dispositivo
3. Validar que la app esté correctamente configurada en Firebase Console

## 📚 Recursos Adicionales

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [React Native Firebase](https://rnfirebase.io/)
- [Testing FCM Messages](https://firebase.google.com/docs/cloud-messaging/send-message#test-your-implementation)
