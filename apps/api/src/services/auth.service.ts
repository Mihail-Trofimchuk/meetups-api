import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Observable, catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';

import { GooglePayload, IRequestWithUser } from '@app/interfaces';
import {
  AccountGoogleAuthTopic,
  AccountLogin,
  AccountLogout,
  AccountRegister,
} from '@app/contracts';
import { User } from '@prisma/client';
import { EmailConfirmationService } from './email-confirmation.service';
import { handleRpcError } from '../filters/rpc.exception';
import { UserLoginDto } from '../dtos/auth/login-user.dto';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { RegisterResponse } from '../response/auth/register-user.response';
import { INFO_MESSAGES } from '../constants/user.constants';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  async register(dto: RegisterUserDto): Promise<Observable<RegisterResponse>> {
    const newUser = await firstValueFrom(
      this.sendRCPRequest(AccountRegister.Topic, dto),
    );

    await this.emailConfirmationService.sendVerificationLink(dto.email);
    return newUser;
  }

  async login(dto: UserLoginDto, res: Response): Promise<string> {
    const { access_token, refresh_token, user } = await firstValueFrom(
      this.sendRCPRequest(AccountLogin.Topic, dto),
    );

    res.cookie(ACCESS_TOKEN, access_token);
    res.cookie(REFRESH_TOKEN, refresh_token);
    return user;
  }

  async updateAccessToken(
    request: IRequestWithUser,
    response: Response,
  ): Promise<User> {
    const userId = request.user.id;
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountLogin.UpdateUserByRefreshTokenTopic, userId),
    );
    response.cookie(ACCESS_TOKEN, access_token);
    return request.user;
  }

  async logOut(response: Response, request: IRequestWithUser): Promise<void> {
    response.cookie(ACCESS_TOKEN, '');
    response.cookie(REFRESH_TOKEN, '');
    const userId = request.user.id;
    await firstValueFrom(this.sendRCPRequest(AccountLogout.Topic, userId));
    response.json({ message: INFO_MESSAGES.USER_LOG_OUT });
  }

  async googleLogin(
    googlePayload: GooglePayload,
    res: Response,
  ): Promise<void> {
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountGoogleAuthTopic, googlePayload),
    );

    res.cookie(ACCESS_TOKEN, access_token);
  }
}
