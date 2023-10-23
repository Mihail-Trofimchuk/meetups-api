import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  AccountConfirmEmailTopic,
  AccountConfirmResponse,
  AccountGoogleAuthTopic,
  AccountLogin,
  AccountRegister,
  AccountSerializerTopic,
} from '@app/contracts';
import { GooglePayload } from '@app/interfaces';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AccountRegister.Topic })
  async register(
    @Payload() registerContract: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    return this.authService.register(registerContract);
  }

  @MessagePattern({ cmd: AccountLogin.Topic })
  async login(
    @Payload()
    loginContract: AccountLogin.Request,
  ): Promise<AccountLogin.Response> {
    return this.authService.login(loginContract);
  }

  @MessagePattern({ cmd: AccountGoogleAuthTopic })
  async googleLogin(
    @Payload()
    googlePayload: GooglePayload,
  ): Promise<AccountLogin.Response> {
    return this.authService.googleLogin(googlePayload);
  }

  @MessagePattern({ cmd: AccountSerializerTopic })
  async serialize(
    @Payload()
    dto: GooglePayload,
  ): Promise<User> {
    return this.authService.findUser(dto);
  }

  @MessagePattern({ cmd: AccountConfirmEmailTopic })
  async confirmEmail(
    @Payload()
    email: string,
  ): Promise<AccountConfirmResponse> {
    return await this.authService.confirmEmail(email);
  }
}
