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
import { SignInDto, SignUpDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { Request } from 'express';
import { User } from 'src/users/user.entity';

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
  async signIn(@Req() request: Request, @Body() signInDto: SignInDto) {
    return this.authService.signIn(request.user as User);
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
