import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class ToiletsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @SubscribeMessage('sensors_data')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    return 'Hello world!';
  }

  handleConnection(client: any) {
    const token = client.handshake.auth.token;
    console.log(client.handshake.auth.token);

    if (token != '123') {
      client.disconnect(true);
      return;
    }

    console.log('Connected');
  }

  handleDisconnect(client: any) {
    console.log('Disconnected');
  }

  afterInit(server: any) {
    console.log('Init');
  }
}
