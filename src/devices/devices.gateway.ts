import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DevicesService } from './devices.service';
import { decodeBase64, extractToken } from 'src/common/utils';
import { UseGuards } from '@nestjs/common';
import { DeviceWsGuard } from './guards/device-ws.guard';
import { DeviceSocket, SensorsData } from './types';
import { Server } from 'socket.io';
import { ToiletsService } from 'src/toilets/toilets.service';

@WebSocketGateway({ cors: true })
export class DevicesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly devicesService: DevicesService,
    private toiletsService: ToiletsService,
  ) {}

  @UseGuards(DeviceWsGuard)
  @SubscribeMessage('sensors_data')
  async handleSensorsData(
    @ConnectedSocket() socket: DeviceSocket,
    @MessageBody() data: SensorsData,
  ) {
    console.log('\nEvent type: sensors_data');
    console.log('Toilet ID:', socket.toiletId);
    console.log('Payload:', data);

    const isOccupied = await this.devicesService.determineToiletOccupancy(data);

    await this.devicesService.updateSensorsData(socket.toiletId, isOccupied);

    const payload = {
      toiletId: socket.toiletId,
      isOccupied,
    };

    console.log('Emitting to organization:', socket.organizationId);

    this.server
      .of('/employee-access')
      .to(socket.organizationId)
      .emit('toilet_occupancy', payload);
  }

  async handleConnection(
    @ConnectedSocket() socket: DeviceSocket,
  ): Promise<void> {
    console.log('connected');
    console.log(socket.handshake.headers);

    try {
      const header = socket.handshake.headers.authorization;
      const encodedPayload = extractToken(header);
      const [toiletId, token] = decodeBase64(encodedPayload);

      await this.devicesService.verifyDevice({
        toiletId,
        token,
      });

      const organizationId =
        await this.toiletsService.getOrganizationId(toiletId);

      socket.organizationId = organizationId;
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
