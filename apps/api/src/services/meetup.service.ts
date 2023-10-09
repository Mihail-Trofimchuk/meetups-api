import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class MeetupService {
  constructor(@Inject('MEETUP_SERVICE') private readonly client: ClientProxy) {}

  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  async createMeetup(createDto: MeetupCreate.Request) {
    return this.sendRCPRequest(MeetupCreate.topic, createDto);
  }

  async findAllMeetups() {
    return this.sendRCPRequest(MeetupSearch.findAllMeetupsTopic, {});
  }

  async updateMeetup(id: number, meetupUpdate: MeetupUpdate.Request) {
    return this.sendRCPRequest(MeetupUpdate.topic, { id, meetupUpdate });
  }

  async deleteMeetup(id: number) {
    return this.sendRCPRequest(MeetupDelete.topic, { id });
  }
}
