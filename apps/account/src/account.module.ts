import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './apps/user/user.module';
import { AuthModule } from './apps/auth/auth.module';
import { FilesModule } from './apps/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
    UserModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AccountModule {}
