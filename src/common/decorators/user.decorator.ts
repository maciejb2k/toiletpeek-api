import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as UserEntity } from 'src/users/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
