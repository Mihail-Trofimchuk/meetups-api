import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { DbService } from '@app/db';

import { UserMeetupService } from './user-meetup.service';
import { UserMeetupController } from './user-meetup.controller';
import { UserMeetupRepository } from './user-meetup.repository';
import { MeetupService } from '../meetup/meetup.service';
import { MeetupRepository } from '../meetup/meetup.repository';
import { MeetupsSearchService } from '../meetups-search/meetups-search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserMeetupController],
  providers: [
    UserMeetupService,
    UserMeetupRepository,
    DbService,
    MeetupService,
    MeetupRepository,
    MeetupsSearchService,
  ],
})
export class UserMeetupModule {}
