import { Inject, Injectable } from '@nestjs/common';
import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class MeetupService {
  constructor(@Inject('MEETUP_SERVICE') private readonly client: ClientProxy) {}

  async createMeetup(createDto: MeetupCreate.Request) {
    return this.client
      .send({ cmd: MeetupCreate.topic }, createDto)
      .pipe(catchError(handleRpcError));
  }

  async findAllMeetups() {
    return this.client.send({ cmd: MeetupSearch.findAllMeetupsTopic }, {});
  }

  async updateMeetup(id: number, meetupUpdate: MeetupUpdate.Request) {
    return this.client.send({ cmd: MeetupUpdate.topic }, { id, meetupUpdate });
  }

  async deleteMeetup(id: number) {
    return this.client.send({ cmd: MeetupDelete.topic }, { id });
  }
}
