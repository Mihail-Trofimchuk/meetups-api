import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  AccountConfirmEmail,
  AccountGoogleAuth,
  AccountLogin,
  AccountRegister,
  AccountSerializer,
} from '@app/contracts';
import { GooglePayload } from '@app/interfaces';

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
    @Payload()
    dto: AccountLogin.Request,
  ) {
    return this.authService.login(dto);
  }

  @MessagePattern({ cmd: AccountGoogleAuth.topic })
  async googleLogin(
    @Payload()
    dto: GooglePayload,
  ) {
    return this.authService.googleLogin(dto);
  }

  @MessagePattern({ cmd: AccountSerializer.topic })
  async serialize(
    @Payload()
    dto: GooglePayload,
  ) {
    return this.authService.findUser(dto);
  }

  @MessagePattern({ cmd: AccountConfirmEmail.topic })
  async confirmEmail(
    @Payload()
    email: string,
  ) {
    return await this.authService.confirmEmail(email);
  }
}
