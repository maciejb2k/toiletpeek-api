import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeviceSocket } from '../types';

@Injectable()
export class DeviceWsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: DeviceSocket = context.switchToWs().getClient();
    return request.isDeviceAuthorized;
  }
}
