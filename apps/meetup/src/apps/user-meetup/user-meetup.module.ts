import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DbService } from '@app/db';

import { UserMeetupService } from './user-meetup.service';
import { UserMeetupController } from './user-meetup.controller';
import { UserMeetupRepository } from './user-meetup.repository';
import { MeetupService } from '../meetup/meetup.service';
import { MeetupRepository } from '../meetup/meetup.repository';

@Module({
  imports: [
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
  controllers: [UserMeetupController],
  providers: [
    UserMeetupService,
    UserMeetupRepository,
    DbService,
    MeetupService,
    MeetupRepository,
  ],
})
export class UserMeetupModule {}
