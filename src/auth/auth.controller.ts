import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrGuard } from '@nest-lab/or-guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';
import { User } from 'src/common/decorators';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user) {
    return this.authService.signIn(user);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('sign-out')
  async signOut(@Req() request: Request) {
    return this.authService.signOut(request);
  }

  @UseGuards(OrGuard([AuthenticatedGuard, JwtAuthGuard]))
  @Get('profile')
  getProfile(@User() user) {
    return user;
  }
}
