import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';

import { IJWTPayload } from '@app/interfaces';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { UserSearch } from '@app/contracts';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAuthStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'access_token' in req.cookies) {
      return req.cookies['access_token'].access_token;
    }
    return null;
  }
  async validate(payload: IJWTPayload) {
    const user = await firstValueFrom(
      this.client
        .send({ cmd: UserSearch.OneUserTopic }, payload.id)
        .pipe(catchError(handleRpcError)),
    );
    return user;
  }
}
