export interface UserDevice {
  socketId: string;
  fcmToken: string;
  lastActive: Date;
  online: boolean;
}
