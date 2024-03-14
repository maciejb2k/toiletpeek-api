import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ToiletsService } from './toilets.service';
import { AuthSocket } from 'src/common/types';
import { decodeBase64 } from 'src/common/utils';

@WebSocketGateway({ cors: true, namespace: 'toilets' })
export class ToiletsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly toiletsService: ToiletsService) {}

  @SubscribeMessage('sensors_data')
  handleSensorsData(@ConnectedSocket() socket: AuthSocket, payload: any) {
    console.log(socket, payload);
  }

  handleConnection(@ConnectedSocket() socket: AuthSocket): void {
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

    const isAuthorized = this.toiletsService.verifyDeviceConnection({
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
