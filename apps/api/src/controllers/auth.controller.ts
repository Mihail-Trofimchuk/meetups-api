import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@app/contracts';
import { GooglePayload } from '@app/interfaces';

import { Response } from 'express';

import { AuthService } from '../services/auth.service';
import { GoogleAuthGuard } from '../guards/google.guard';
import { GetGooglePayload } from '../decorators/google-payload.decorator';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {}

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

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Res() response: Response) {
    this.authService.getCookieForLogOut(response);
    return response.sendStatus(200);
  }

  @Get('confirm?')
  async confirm(@Query('token') token: string) {
    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    return this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(@Req() request) {
    await this.emailConfirmationService.resendConfirmationLink(
      request.user.user.id,
    );
  }
}
