import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInDto, SignUpDto } from './dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(request: Request, signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const user = await this.validateUser(email, password);

    return user;
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
