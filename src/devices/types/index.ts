import { Socket } from 'socket.io';

export type DeviceSocket = Socket & {
  isDeviceAuthorized: boolean;
  toiletId: string;
};
