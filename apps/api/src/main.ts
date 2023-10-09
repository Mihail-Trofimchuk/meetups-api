import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { ApiModule } from './api.module';
import { RpcExceptionToHttpExceptionFilter } from './filters/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.useGlobalFilters(new RpcExceptionToHttpExceptionFilter());
  const configService = app.get(ConfigService);
  const SESSION_SECRET = configService.get<string>('SESSION_SECRET');
  app.use(
    session({
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
}
bootstrap();
