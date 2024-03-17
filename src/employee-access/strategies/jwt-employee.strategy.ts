import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeeAccessJWT } from '../types';

@Injectable()
export class JwtEmployeeStrategy extends PassportStrategy(
  Strategy,
  'jwt-employee',
) {
  constructor(private configService: ConfigService) {
    super({
      usernameField: 'organizationId',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_EMPLOYEE_SECRET'),
    });
  }

  async validate(payload: EmployeeAccessJWT) {
    return payload;
  }
}
