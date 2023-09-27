import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../../config/jwt.config';
import { DbModule } from '@app/db';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DbModule, UserModule, JwtModule.registerAsync(getJWTConfig())],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
