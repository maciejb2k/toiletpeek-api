import { Socket } from 'socket.io';

export type DeviceSocket = Socket & {
  isDeviceAuthorized: boolean;
  toiletId: string;
  organizationId: string;
};

export type SensorsData = {
  isDoorOpen: boolean;
  isLightOn?: boolean;
  isMotionDetected?: boolean;
};
