import { AccountLogin, AccountRegister } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

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

  login(dto: AccountLogin.Request) {
    return this.client
      .send({ cmd: AccountLogin.topic }, dto)
      .pipe(catchError(handleRpcError));
  }
}
