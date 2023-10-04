import { AccountLogin, AccountRegister } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { Response } from 'express';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class AuthService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {}

  register(dto: AccountRegister.Request) {
    return this.client
      .send({ cmd: AccountRegister.topic }, dto)
      .pipe(catchError(handleRpcError));
  }

  async login(dto: AccountLogin.Request, res: Response) {
    const access_token = await this.client
      .send({ cmd: AccountLogin.topic }, dto)
      .pipe(catchError(handleRpcError))
      .toPromise();
    res.cookie('access_token', access_token);
    return access_token;
  }
}
