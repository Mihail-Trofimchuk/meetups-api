import { Module } from '@nestjs/common';

import { DbService } from '@app/db';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [UserController],
  providers: [DbService, UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
