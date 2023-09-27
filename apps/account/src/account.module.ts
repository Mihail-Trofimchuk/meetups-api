import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    UserModule,
    AuthModule,
    RMQModule.forRootAsync(getRMQConfig()),
  ],
  controllers: [],
  providers: [],
})
export class AccountModule {}
