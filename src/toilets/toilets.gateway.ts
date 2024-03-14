import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ToiletsService } from './toilets.service';
import { AuthSocket } from 'src/common/types';
import { decodeBase64 } from 'src/common/utils';
import { UseGuards } from '@nestjs/common';
import { WsToiletGuard } from './guards/ws-toilet.guard';

@WebSocketGateway({ cors: true })
export class ToiletsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly toiletsService: ToiletsService) {}

  @UseGuards(WsToiletGuard)
  @SubscribeMessage('sensors_data')
  handleSensorsData(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() data: string,
  ) {
    console.log('\nEvent type: sensors_data');
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
    const isAuthorized = await this.toiletsService.verifyDeviceConnection({
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
