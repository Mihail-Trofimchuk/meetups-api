import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import * as geolib from 'geolib';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { toNumber } from 'lodash';

import { Meetup } from '@prisma/client';
import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';
import { CenterСoordinates } from '@app/interfaces';

import { CONVERT_TO_KM } from '../constants/meetup.constants';
import { MeetupFilterDto } from '../dtos/meetups-filter.dto';
import { generatePDF } from '../utils/pdf-generator';
import { handleRpcError } from '../filters/rpc.exception';
import { MeetupCreateDto } from '../dtos/meetup/create-meetup.dto';
import { CreateResponse } from '../response/meetup/create-meetup.response';
import { MeetupUpdateDto } from '../dtos/meetup/update-meetup.dto';
import { UpdateResponse } from '../response/meetup/update-meetup.response';
import { DeleteResponse } from '../response/meetup/delete-meetup.response';
import { MeetupSearchDto } from '../dtos/meetup/search-meetup.dto';
import { SearchResponse } from '../response/meetup/search-meetup.response';

function isMeetupInRadius(
  meetup: Meetup,
  center: CenterСoordinates,
  radius: number,
) {
  const meetupCoords = {
    latitude: toNumber(meetup.latitude),
    longitude: toNumber(meetup.longitude),
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

  async createMeetup(
    dto: MeetupCreateDto,
    createdById: number,
  ): Promise<Observable<CreateResponse>> {
    return this.sendRCPRequest(MeetupCreate.Topic, {
      ...dto,
      createdById,
    });
  }

  async findAllMeetups(): Promise<Observable<SearchResponse[]>> {
    return this.sendRCPRequest(MeetupSearch.FindAllMeetupsTopic, {});
  }

  async updateMeetup(
    meetupId: number,
    updateDto: MeetupUpdateDto,
    userId: number,
  ): Promise<Observable<UpdateResponse>> {
    return this.sendRCPRequest(MeetupUpdate.topic, {
      ...updateDto,
      meetupId,
      userId,
    });
  }

  async deleteMeetup(
    meetupId: number,
    userId: number,
  ): Promise<Observable<DeleteResponse>> {
    return this.sendRCPRequest(MeetupDelete.Topic, { meetupId, userId });
  }

  async findMeetupsInRadius(
    filterDto: MeetupFilterDto,
  ): Promise<Observable<SearchResponse[]>> {
    const { latitude, longitude, radius } = filterDto;

    const meetups = await firstValueFrom(
      this.sendRCPRequest(MeetupSearch.FindAllMeetupsTopic, {}),
    );

    if (!latitude || !longitude || !radius) {
      return meetups;
    }

    const center = { latitude, longitude };

    return meetups.filter((meetup: Meetup) =>
      isMeetupInRadius(meetup, center, radius),
    );
  }

  async generarPDF(): Promise<Buffer> {
    const meetups = await firstValueFrom(
      this.sendRCPRequest(MeetupSearch.FindAllMeetupsTopic, {}),
    );

    return generatePDF(meetups);
  }

  async findMeetupsWithElastic(
    searchDto: MeetupSearchDto,
  ): Promise<Observable<SearchResponse[]>> {
    return this.sendRCPRequest(
      MeetupSearch.FindAllMeetupsElasticTopic,
      searchDto,
    );
  }
}
