import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'apps/account/src/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controllers/user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './services/auth.service';
import { MeetupController } from './controllers/meetup.controller';
import { MeetupService } from './services/meetup.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
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
          urls: ['amqp://localhost:5672'],
          queue: 'meetup_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, MeetupController, UserController],
  providers: [AuthService, MeetupService],
})
export class ApiModule {}
