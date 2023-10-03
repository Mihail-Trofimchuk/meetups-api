import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { MeetupRepository } from './meetup.repository';
import { DbService } from '@app/db';

@Module({
  imports: [],
  controllers: [MeetupController],
  providers: [MeetupService, MeetupRepository, DbService],
})
export class MeetupModule {}
