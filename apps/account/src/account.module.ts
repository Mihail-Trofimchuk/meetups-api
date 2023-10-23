import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AccountModule {}
