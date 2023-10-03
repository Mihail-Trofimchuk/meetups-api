import { Controller } from '@nestjs/common';

import { AccountLogin, AccountRegister } from '@app/contracts';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AccountRegister.topic })
  async register(
    @Payload() registerDto: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    return this.authService.register(registerDto);
  }

  @MessagePattern({ cmd: AccountLogin.topic })
  async login(
    @Payload() { email, password }: AccountLogin.Request,
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);

    return this.authService.login(String(id));
  }
}
