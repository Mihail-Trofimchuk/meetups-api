import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError } from 'rxjs';
import * as geolib from 'geolib';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';
import { MeetupFilterDto } from '../dtos/meetups-filter.dto';
import { CONVERT_TO_KM } from '../constants/meetup.constants';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

function isMeetupInRadius(meetup, center, radius: number) {
  const meetupCoords = {
    latitude: meetup.latitude,
    longitude: meetup.longitude,
  };
  const distance = geolib.getDistance(center, meetupCoords);
  return distance <= radius * CONVERT_TO_KM;
}

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

  async findMeetupsInRadius(filterDto: MeetupFilterDto) {
    const { latitude, longitude, radius } = filterDto;

    const meetups = await this.sendRCPRequest(
      MeetupSearch.findAllMeetupsTopic,
      {},
    ).toPromise();

    if (!latitude || !longitude || !radius) {
      return meetups;
    }

    const center = { latitude, longitude };

    return meetups.filter((meetup) => isMeetupInRadius(meetup, center, radius));
  }
}
