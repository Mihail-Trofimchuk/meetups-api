import { Module } from '@nestjs/common';

import { DbService } from '@app/db';

import { MeetupController } from './apps/meetup/meetup.controller';
import { MeetupService } from './apps/meetup/meetup.service';
import { MeetupRepository } from './apps/meetup/meetup.repository';
import { UserMeetupService } from './apps/user-meetup/user-meetup.service';
import { UserMeetupModule } from './apps/user-meetup/user-meetup.module';
import { UserMeetupRepository } from './apps/user-meetup/user-meetup.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    UserMeetupModule,
    ClientsModule.register([
      {
        name: 'ACCOUNT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'account_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [MeetupController],
  providers: [
    MeetupService,
    MeetupRepository,
    DbService,
    UserMeetupService,
    UserMeetupRepository,
  ],
})
export class MeetupModule {}
