import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AccountLogin, AccountRegister } from '@app/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: AccountRegister.Request) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: AccountLogin.Request) {
    return this.authService.login(dto);
  }
}
