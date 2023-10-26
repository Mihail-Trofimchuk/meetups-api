import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';

import { MeetupService } from './meetup.service';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern({ cmd: MeetupCreate.Topic })
  async createMeetup(
    @Payload() createContract: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    return this.meetupService.createMeetup(createContract);
  }

  @MessagePattern({ cmd: MeetupSearch.FindAllMeetupsTopic })
  async findAllMeetups(): Promise<MeetupSearch.Response[]> {
    return this.meetupService.findAllMeetups();
  }

  @MessagePattern({ cmd: MeetupUpdate.topic })
  async updateMeetup(
    @Payload()
    meetupUpdate: MeetupUpdate.Request & { meetupId: number; userId: number },
  ): Promise<MeetupUpdate.Response> {
    const { meetupId, userId, ...updateDto } = meetupUpdate;
    return this.meetupService.updateMeetup(updateDto, meetupId, userId);
  }

  @MessagePattern({ cmd: MeetupDelete.Topic })
  async deleteMeetup(
    @Payload() deleteContract: MeetupDelete.Request,
  ): Promise<MeetupDelete.Response> {
    return this.meetupService.deleteMeetup(deleteContract);
  }

  @MessagePattern({ cmd: MeetupSearch.FindAllMeetupsElasticTopic })
  async findAllMeetupsElastic(
    @Payload() searchContract: MeetupSearch.ElasticQuery,
  ): Promise<MeetupSearch.Response> {
    return this.meetupService.findAllMeetupsElastic(searchContract);
  }
}
