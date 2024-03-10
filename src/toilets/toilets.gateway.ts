import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ToiletsService } from './toilets.service';
import { AuthSocket } from 'src/common/types';

@WebSocketGateway({ cors: true })
export class ToiletsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly toiletsService: ToiletsService) {}

  @SubscribeMessage('sensors_data')
  handleSensorsData(@ConnectedSocket() socket: AuthSocket, payload: any) {}

  handleConnection(@ConnectedSocket() socket: AuthSocket): void {
    const token = socket.handshake.headers.token as string;
    const toiletId = socket.handshake.headers.toiletId as string;
    const deviceId = socket.handshake.headers.deviceId as string;

    const isAuthorized = this.toiletsService.verifyDeviceConnection({
      token,
      toiletId,
      deviceId,
    });

    if (!isAuthorized) {
      socket.disconnect();
    }

    socket.isAuthorized = true;
  }

  handleDisconnect(@ConnectedSocket() socket: AuthSocket): void {
    socket.isAuthorized = false;
  }
}
