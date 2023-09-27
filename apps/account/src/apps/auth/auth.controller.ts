import { Body, Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RMQRoute, RMQValidate } from 'nestjs-rmq';

import { AccountLogin, AccountRegister } from '@app/contracts';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private conf: ConfigService,
  ) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() registerDto: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    return this.authService.register(registerDto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request,
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(String(id));
  }
}
