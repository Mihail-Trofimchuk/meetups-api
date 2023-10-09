import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { VerifyCallback } from 'passport-jwt';
import { catchError } from 'rxjs';

import { GooglePayload } from '@app/interfaces';
import { AccountSerializer } from '@app/contracts';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy) {
    super();
  }

  serializeUser(user: GooglePayload, done) {
    done(null, user);
  }

  async deserializeUser(payload: GooglePayload, done: VerifyCallback) {
    const user = await this.client
      .send({ cmd: AccountSerializer.topic }, payload)
      .pipe(catchError(handleRpcError))
      .toPromise();
    return user ? done(null, user) : done(null, null);
  }
}
