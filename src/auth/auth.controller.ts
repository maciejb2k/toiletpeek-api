import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';

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
  async signIn(@Req() request: Request) {
    return this.authService.signIn(request);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('sign-out')
  async signOut(@Req() request: Request) {
    return this.authService.signOut(request);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
