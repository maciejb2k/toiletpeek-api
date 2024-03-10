import {
  HttpStatus,
  Injectable,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new UnprocessableEntityException(
        'Sorry, this email address is not available. Please choose another one.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPassword,
    });

    return user;
  }

  async signIn(@Req() request: Request): Promise<any> {
    const user: any = request.user;
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      statusCode: HttpStatus.OK,
      accessToken,
    };
  }

  async signInJwt(user: User): Promise<any> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async signOut(@Req() request: Request): Promise<any> {
    request.session.destroy(() => {
      return {
        message: 'Logout successful',
        statusCode: HttpStatus.OK,
      };
    });
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
