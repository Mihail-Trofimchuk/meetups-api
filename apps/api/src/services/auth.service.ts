import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Observable, catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';

import { GooglePayload } from '@app/interfaces';
import {
  AccountGoogleAuthTopic,
  AccountLogin,
  AccountRegister,
} from '@app/contracts';
import { EmailConfirmationService } from './email-confirmation.service';
import { handleRpcError } from '../filters/rpc.exception';
import { UserLoginDto } from '../dtos/auth/login-user.dto';
import { RegisterUserDto } from '../dtos/auth/register-user.dto';
import { RegisterResponse } from '../response/auth/register-user.response';
import { INFO_MESSAGES } from '../constants/user.constants';

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
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountLogin.Topic, dto),
    );

    res.cookie('access_token', access_token);
    return access_token;
  }

  async getCookieForLogOut(response: Response) {
    response.cookie('access_token', '');
    response.json({ message: INFO_MESSAGES.USER_LOG_OUT });
  }

  async googleLogin(googlePayload: GooglePayload, res: Response) {
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountGoogleAuthTopic, googlePayload),
    );

    res.cookie('access_token', access_token);
  }
}
