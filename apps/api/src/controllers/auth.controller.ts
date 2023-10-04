import { AccountLogin, AccountRegister } from '@app/contracts';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
