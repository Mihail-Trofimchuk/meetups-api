import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { User } from '@prisma/client';
import {
  AccountConfirmEmailTopic,
  AccountConfirmResponse,
  AccountGoogleAuthTopic,
  AccountLogin,
  AccountLogout,
  AccountRegister,
  AccountSerializerTopic,
} from '@app/contracts';
import { GooglePayload } from '@app/interfaces';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: AccountRegister.Topic })
  async register(
    @Payload() registerContract: AccountRegister.Request,
  ): Promise<AccountRegister.Response> {
    return await this.authService.register(registerContract);
  }

  @MessagePattern({ cmd: AccountLogin.Topic })
  async login(
    @Payload()
    loginContract: AccountLogin.Request,
  ): Promise<AccountLogin.Response> {
    return this.authService.login(loginContract);
  }

  @MessagePattern({ cmd: AccountLogin.UpdateUserByRefreshTokenTopic })
  async updateAccessToken(@Payload() userId: number) {
    const token = await this.authService.updateAccessToken(userId);
    return token;
  }

  @MessagePattern({ cmd: AccountLogin.GetUserByRefreshTokenTopic })
  async getUserIfRefreshTokenMatches(
    @Payload()
    { userId, refreshToken }: { userId: number; refreshToken: string },
  ) {
    return this.authService.getUserIfRefreshTokenMatches(userId, refreshToken);
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

  @MessagePattern({ cmd: AccountLogout.Topic })
  async logout(
    @Payload()
    userId: number,
  ): Promise<AccountConfirmResponse> {
    return await this.authService.logout(userId);
  }
}
