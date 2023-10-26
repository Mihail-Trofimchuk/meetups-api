import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { IJWTPayload } from '@app/interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { handleRpcError } from '../filters/rpc.exception';
import { AccountLogin } from '@app/contracts';
import { REFRESH_TOKEN } from '../constants/auth.constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  static extractJWT(req: Request): string | null {
    if (req.cookies && REFRESH_TOKEN in req.cookies) {
      return req.cookies[REFRESH_TOKEN];
    }
    return null;
  }

  async validate(request: Request, payload: IJWTPayload) {
    const refreshToken = request.cookies[REFRESH_TOKEN];
    const userId = payload.userId;
    const user = await firstValueFrom(
      this.client
        .send(
          { cmd: AccountLogin.GetUserByRefreshTokenTopic },
          { userId, refreshToken },
        )
        .pipe(catchError(handleRpcError)),
    );
    return user;
  }
}
