import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EmployeeAccessJWT, EmployeeAccessSocket } from './types';
import { extractToken } from 'src/common/utils';

@WebSocketGateway({ cors: true, namespace: 'employee-access' })
export class EmployeeAccessGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  handleConnection(@ConnectedSocket() socket: EmployeeAccessSocket) {
    try {
      const header = socket.handshake.headers.authorization;
      const token = extractToken(header);
      const organization: EmployeeAccessJWT = this.jwtService.verify(token);

      socket.isEmployeeAuthorized = true;
      socket.organizationId = organization.sub;
      socket.join(organization.sub);

      console.log('Client authorized and connected.', organization);
    } catch (error) {
      console.log('Client unauthorized!');
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: EmployeeAccessSocket) {
    delete socket.isEmployeeAuthorized;
    delete socket.organizationId;

    console.log('Client disconnected.');
  }
}
