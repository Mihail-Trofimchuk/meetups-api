import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request as RequestType } from 'express';
import { catchError, firstValueFrom } from 'rxjs';

import { IJWTPayload } from '@app/interfaces';
import { UserSearch } from '@app/contracts';
import { handleRpcError } from '../filters/rpc.exception';
import { ACCESS_TOKEN } from '../constants/auth.constants';

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
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  static extractJWT(req: RequestType): string | null {
    if (req.cookies && ACCESS_TOKEN in req.cookies) {
      return req.cookies[ACCESS_TOKEN];
    }
    return null;
  }
  async validate(payload: IJWTPayload) {
    const user = await firstValueFrom(
      this.client
        .send({ cmd: UserSearch.OneUserTopic }, payload.userId)
        .pipe(catchError(handleRpcError)),
    );
    return user;
  }
}
