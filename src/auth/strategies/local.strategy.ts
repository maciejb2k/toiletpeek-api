import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    return await this.authService.validateUser(email, password);
  }
}
