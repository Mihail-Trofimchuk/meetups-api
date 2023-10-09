import { Module } from '@nestjs/common';

import { DbService } from '@app/db';

import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { MeetupRepository } from './meetup.repository';

@Module({
  imports: [],
  controllers: [MeetupController],
  providers: [MeetupService, MeetupRepository, DbService],
})
export class MeetupModule {}
