import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';
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
    const newUser = await this.sendRCPRequest(
      AccountRegister.topic,
      dto,
    ).toPromise();

    await this.emailConfirmationService.sendVerificationLink(dto.email);
    return newUser;
  }

  async login(dto: AccountLogin.Request, res: Response) {
    const access_token = await this.sendRCPRequest(
      AccountLogin.topic,
      dto,
    ).toPromise();

    res.cookie('access_token', access_token);
    return access_token;
  }

  async googleLogin(googlePayload: GooglePayload, res: Response) {
    const access_token = await this.sendRCPRequest(
      AccountGoogleAuth.topic,
      googlePayload,
    ).toPromise();

    res.cookie('access_token', access_token);
  }
}
