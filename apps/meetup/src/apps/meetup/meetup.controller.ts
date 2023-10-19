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

  @MessagePattern({ cmd: MeetupCreate.topic })
  async createMeetup(
    @Payload()
    {
      createDto,
      createdById,
    }: {
      createDto: MeetupCreate.MeetupRequest;
      createdById: number;
    },
  ): Promise<MeetupCreate.Response> {
    return this.meetupService.createMeetup(createDto, createdById);
  }

  @MessagePattern({ cmd: MeetupSearch.findAllMeetupsTopic })
  async findAllMeetups(): Promise<MeetupSearch.Response[]> {
    return this.meetupService.findAllMeetups();
  }

  @MessagePattern({ cmd: MeetupUpdate.topic })
  async updateMeetup(
    @Payload()
    {
      id,
      meetupUpdate,
      userId,
    }: {
      id: number;
      meetupUpdate: MeetupUpdate.Request;
      userId: number;
    },
  ): Promise<MeetupUpdate.Response> {
    return this.meetupService.updateMeetup(id, meetupUpdate, userId);
  }

  @MessagePattern({ cmd: MeetupDelete.topic })
  async deleteMeetup(
    @Payload()
    { id, userId }: { id: number; userId: number },
  ): Promise<MeetupDelete.Response> {
    return this.meetupService.deleteMeetup(id, userId);
  }

  @MessagePattern({ cmd: MeetupSearch.findAllMeetupsElasticTopic })
  async findAllMeetupsElastic(
    @Payload() searchDto: MeetupSearch.MeetupSearchDto,
  ) {
    return this.meetupService.findAllMeetupsElastic(searchDto);
  }
}
