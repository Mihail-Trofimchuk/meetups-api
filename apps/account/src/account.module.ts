import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from './auth/auth.module';
import { AuthModule } from './apps/auth/auth.module';
import { UserModule } from './apps/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
