import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { DevicesService } from './devices.service';
import { decodeBase64 } from 'src/common/utils';
import { UseGuards } from '@nestjs/common';
import { DeviceWsGuard } from './guards/device-ws.guard';
import { DeviceSocket } from './types';

@WebSocketGateway({ cors: true })
export class DevicesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(DeviceWsGuard)
  @SubscribeMessage('sensors_data')
  handleSensorsData(
    @ConnectedSocket() socket: DeviceSocket,
    @MessageBody() data: string,
  ) {
    console.log('\nEvent type: sensors_data');
    console.log('Toilet ID:', socket.toiletId);
    console.log('Payload:', data);
  }

  async handleConnection(
    @ConnectedSocket() socket: DeviceSocket,
  ): Promise<void> {
    console.log('connected');
    console.log(socket.handshake.headers);

    try {
      const header = socket.handshake.headers.authorization;
      const encodedPayload = header.split(' ')[1] as string;
      const [toiletId, token] = decodeBase64(encodedPayload);

      await this.devicesService.verifyDevice({
        toiletId,
        token,
      });

      socket.isDeviceAuthorized = true;
      socket.toiletId = toiletId;

      console.log('Successfully connected and authorized to the server!');
    } catch (error) {
      console.log('Client unauthorized');
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: DeviceSocket): void {
    delete socket.isDeviceAuthorized;
    delete socket.toiletId;
    console.log('disconnected');
  }
}
