import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MeetupService } from './meetup.service';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern({ cmd: MeetupCreate.topic })
  async createMeetup(
    @Payload() createDto: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    return this.meetupService.createMeetup(createDto);
  }

  @MessagePattern({ cmd: MeetupSearch.findAllMeetupsTopic })
  async findAllMeetups(): Promise<MeetupCreate.Response[]> {
    return this.meetupService.findAllMeetups();
  }

  @MessagePattern({ cmd: MeetupUpdate.topic })
  async updateMeetup(
    @Payload()
    { id, meetupUpdate }: { id: number; meetupUpdate: MeetupUpdate.Request },
  ): Promise<MeetupUpdate.Response> {
    return this.meetupService.updateMeetup(id, meetupUpdate);
  }

  @MessagePattern({ cmd: MeetupDelete.topic })
  async deleteMeetup(
    @Payload() deletedto: MeetupDelete.Request,
  ): Promise<MeetupDelete.Response> {
    return this.meetupService.deleteMeetup(deletedto);
  }
}
