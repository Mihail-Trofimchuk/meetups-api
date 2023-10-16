import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';

import { VerificationTokenPayload } from '@app/interfaces';
import { AccountConfirmEmail, UserSearch } from '@app/contracts';
import EmailService from './email.service';
import {
  ALREADY_CONFIRMED_ERROR,
  BAD_TOKEN_ERROR,
  EMAIL_EXPIRED_ERROR,
  EMAIL_SUBJECT,
  EMAIL_TEXT,
} from '../constants/email.constants';
import { handleRpcError } from '../filters/rpc.exception';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `${EMAIL_TEXT}: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: EMAIL_SUBJECT,
      text,
    });
  }

  public async confirmEmail(email: string) {
    return this.client
      .send({ cmd: AccountConfirmEmail.topic }, email)
      .pipe(catchError(handleRpcError));
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException(EMAIL_EXPIRED_ERROR);
      }
      throw new BadRequestException(BAD_TOKEN_ERROR);
    }
  }

  public async resendConfirmationLink(userId: number) {
    const user = await firstValueFrom(
      this.client
        .send({ cmd: UserSearch.findOneTopic }, userId)
        .pipe(catchError(handleRpcError)),
    );

    if (user.user.isEmailConfirmed) {
      throw new BadRequestException(ALREADY_CONFIRMED_ERROR);
    }

    await this.sendVerificationLink(user.user.email);
  }
}
