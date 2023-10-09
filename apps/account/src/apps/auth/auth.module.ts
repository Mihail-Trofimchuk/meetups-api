import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DbModule } from '@app/db';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJWTConfig } from '../../config/jwt.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DbModule, UserModule, JwtModule.registerAsync(getJWTConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
