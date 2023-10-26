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
import { ApiTags } from '@nestjs/swagger';

import { GooglePayload, IRequestWithUser } from '@app/interfaces';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { User } from '@prisma/client';
import { AccountConfirmResponse } from '@app/contracts';
import { GetGooglePayload } from '../decorators/google-payload.decorator';
import { GoogleAuthGuard } from '../guards/google.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { UserLoginDto } from '../dtos/auth/login-user.dto';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { RegisterResponse } from '../response/auth/register-user.response';
import JwtRefreshGuard from '../guards/jwtRefresh.guard';

@ApiTags('auth')
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
  async register(
    @Body() dto: RegisterUserDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    return this.authService.login(dto, res);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() request: IRequestWithUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<User> {
    return this.authService.updateAccessToken(request, response);
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(
    @Res() response: Response,
    @Req() request: IRequestWithUser,
  ): Promise<void> {
    this.authService.logOut(response, request);
  }

  @Get('confirm?')
  async confirm(
    @Query('token') token: string,
  ): Promise<Observable<AccountConfirmResponse>> {
    const email =
      await this.emailConfirmationService.decodeConfirmationToken(token);
    return this.emailConfirmationService.confirmEmail(email);
  }

  @Post('resend-confirmation-link')
  @UseGuards(JwtAuthGuard)
  async resendConfirmationLink(
    @Req() request: IRequestWithUser,
    @Res() response: Response,
  ) {
    await this.emailConfirmationService.resendConfirmationLink(
      request.user.id,
      response,
    );
  }
}
