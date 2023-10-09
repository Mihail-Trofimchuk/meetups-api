import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { config } from 'dotenv';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

config();

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('CLIENT_SECRET'),
      callbackURL: configService.get('CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      avatar: photos[0].value,
      accessToken,
    };

    done(null, user);
  }
}
