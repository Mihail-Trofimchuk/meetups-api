import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@app/contracts';
import { GooglePayload } from '@app/interfaces';

import { Response } from 'express';

import { AuthService } from '../services/auth.service';
import { GoogleAuthGuard } from '../guards/google.guard';
import { GetGooglePayload } from '../decorators/google-payload.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {}

  // api/auth/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect(
    @GetGooglePayload() googlePayload: GooglePayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleLogin(googlePayload, res);
  }

  @Post('register')
  async register(@Body() dto: AccountRegister.Request) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: AccountLogin.Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }
}
