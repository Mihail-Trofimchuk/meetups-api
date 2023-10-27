import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';

import { getJWTConfig } from 'apps/account/src/config/jwt.config';
import { AuthController } from './controllers/auth.controller';
import { MeetupController } from './controllers/meetup.controller';
import { UserMeetupController } from './controllers/user-meetup.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { EmailConfirmationService } from './services/email-confirmation.service';
import EmailService from './services/email.service';
import { MeetupService } from './services/meetup.service';
import { UserMeetupService } from './services/user-meetup.service';
import { UserService } from './services/user.service';
import { GoogleAuthStrategy } from './strategy/google.strategy';
import { JwtAuthStrategy } from './strategy/jwt.strategy';
import { GoogleCloudService } from './utils/google-cloud';
import { SessionSerializer } from './utils/serializer';
import { JwtRefreshTokenStrategy } from './strategy/refresh.strategy';
import { TagController } from './controllers/tag.controller';
import { TagService } from './services/tag.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    /// Local Storage
    // MulterModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     dest: configService.get<string>('MULTER_DEST'),
    //   }),
    //   inject: [ConfigService],
    // }),
    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rmq:5672'],
          queue: 'account_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MEETUP_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rmq:5672'],
          queue: 'meetup_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    AuthController,
    MeetupController,
    UserController,
    UserMeetupController,
    TagController,
  ],
  providers: [
    GoogleCloudService,
    EmailService,
    EmailConfirmationService,
    AuthService,
    MeetupService,
    UserService,
    JwtAuthStrategy,
    GoogleAuthStrategy,
    JwtRefreshTokenStrategy,
    SessionSerializer,
    UserMeetupService,
    TagService,
  ],
})
export class ApiModule {}
