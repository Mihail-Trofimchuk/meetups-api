import { Module } from '@nestjs/common';

import { DbService } from '@app/db';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagRepository } from './tag.repository';

@Module({
  controllers: [TagController],
  providers: [TagService, TagRepository, DbService],
  exports: [TagService],
})
export class TagModule {}
