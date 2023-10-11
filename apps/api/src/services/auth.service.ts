import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';

import { GooglePayload } from '@app/interfaces';
import {
  AccountGoogleAuth,
  AccountLogin,
  AccountRegister,
} from '@app/contracts';
import { EmailConfirmationService } from './email-confirmation.service';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

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

  async register(dto: AccountRegister.Request) {
    const newUser = await firstValueFrom(
      this.sendRCPRequest(AccountRegister.topic, dto),
    );

    await this.emailConfirmationService.sendVerificationLink(dto.email);
    return newUser;
  }

  async login(dto: AccountLogin.Request, res: Response) {
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountLogin.topic, dto),
    );

    res.cookie('access_token', access_token);
    return access_token;
  }

  async googleLogin(googlePayload: GooglePayload, res: Response) {
    const access_token = await firstValueFrom(
      this.sendRCPRequest(AccountGoogleAuth.topic, googlePayload),
    );

    res.cookie('access_token', access_token);
  }
}
