import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import { FilesModule } from './apps/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    UserModule,
    AuthModule,
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
    ]),
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AccountModule {}
