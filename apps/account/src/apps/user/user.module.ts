import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DbService } from '@app/db';

@Module({
  controllers: [],
  providers: [DbService, UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
