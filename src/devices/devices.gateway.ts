import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { DevicesService } from './devices.service';
import { AuthSocket } from 'src/common/types';
import { decodeBase64 } from 'src/common/utils';
import { UseGuards } from '@nestjs/common';
import { DeviceAuthGuard } from './guards/device-auth.guard';

@WebSocketGateway({ cors: true })
export class DevicesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(DeviceAuthGuard)
  @SubscribeMessage('sensors_data')
  handleSensorsData(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() data: string,
  ) {
    console.log('\nEvent type: sensors_data');
    console.log('Toilet ID:', socket.toiletId);
    console.log('Payload:', data);
  }

  async handleConnection(@ConnectedSocket() socket: AuthSocket): Promise<void> {
    console.log('connected');
    console.log(socket.handshake.headers);

    const encodedPayload = socket.handshake.headers.authorization.split(
      ' ',
    )[1] as string;

    if (!encodedPayload) {
      socket.disconnect();
      return;
    }

    const [toiletId, token] = decodeBase64(encodedPayload);
    const isAuthorized = await this.devicesService.verifyDevice({
      toiletId,
      token,
    });

    if (!isAuthorized) {
      socket.disconnect();
      return;
    }

    console.log('Successfully connected and authorized to the server!');

    socket.isAuthorized = true;
    socket.toiletId = toiletId;
  }

  handleDisconnect(@ConnectedSocket() socket: AuthSocket): void {
    delete socket.isAuthorized;
    delete socket.toiletId;
    console.log('disconnected');
  }
}
