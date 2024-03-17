import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmployeeAccessSocket } from '../types';

@Injectable()
export class EmployeeWsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: EmployeeAccessSocket = context.switchToWs().getClient();
    return request.isEmployeeAuthorized;
  }
}
