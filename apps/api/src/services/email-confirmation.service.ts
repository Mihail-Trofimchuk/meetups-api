import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';
import { Response } from 'express';

import { VerificationTokenPayload } from '@app/interfaces';
import { AccountConfirmEmailTopic, UserSearch } from '@app/contracts';
import EmailService from './email.service';
import {
  EMAIL_SUBJECT,
  EMAIL_TEXT,
  ERROR_MESSAGES,
  INFO_MESSAGES,
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
      .send({ cmd: AccountConfirmEmailTopic }, email)
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
        throw new BadRequestException(ERROR_MESSAGES.EMAIL_EXPIRED);
      }
      throw new BadRequestException(ERROR_MESSAGES.BAD_TOKEN);
    }
  }

  public async resendConfirmationLink(userId: number, response: Response) {
    const user = await firstValueFrom(
      this.client
        .send({ cmd: UserSearch.OneUserTopic }, userId)
        .pipe(catchError(handleRpcError)),
    );

    if (user.user.isEmailConfirmed) {
      throw new BadRequestException(ERROR_MESSAGES.ALREADY_CONFIRMED);
    }

    await this.sendVerificationLink(user.user.email);
    response.json({ message: INFO_MESSAGES.EMAIL_RESEND });
  }
}
