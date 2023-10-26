import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DbService } from '@app/db';

import { ConfigModule } from '@nestjs/config';
import { MeetupController } from './apps/meetup/meetup.controller';
import { MeetupRepository } from './apps/meetup/meetup.repository';
import { MeetupService } from './apps/meetup/meetup.service';
import { MeetupsSearchModule } from './apps/meetups-search/meetups-search.module';
import { UserMeetupModule } from './apps/user-meetup/user-meetup.module';
import { UserMeetupRepository } from './apps/user-meetup/user-meetup.repository';
import { UserMeetupService } from './apps/user-meetup/user-meetup.service';
import { TagModule } from './apps/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.meetup.env' }),
    MeetupsSearchModule,
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
    TagModule,
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
