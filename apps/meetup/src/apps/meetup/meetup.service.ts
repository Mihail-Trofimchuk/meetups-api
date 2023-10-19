import { ConflictException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';

import { MeetupsSearchService } from '../meetups-search/meetups-search.service';
import { MeetupRepository } from './meetup.repository';
import {
  ACCESS_DENIED_ERROR,
  MEETUP_ALREADY_EXISTS,
  MEETUP_NOT_FOUND_ERROR,
} from './meetup.constants';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly meetupsSearchModule: MeetupsSearchService,
  ) {}

  async createMeetup(
    createDto: MeetupCreate.MeetupRequest,
    createdById: number,
  ): Promise<MeetupCreate.Response> {
    const meetup = await this.meetupRepository.findMeetupByTitle(
      createDto.title,
    );

    if (meetup) {
      throw new RpcException(new ConflictException(MEETUP_ALREADY_EXISTS));
    }

    const newMeetup = await this.meetupRepository.create(
      createDto,
      createdById,
    );

    this.meetupsSearchModule.indexMeetup(newMeetup);
    return newMeetup;
  }

  async findAllMeetups(): Promise<MeetupSearch.Response[]> {
    return await this.meetupRepository.findAll();
  }

  async findMeetupByTitle(email: string): Promise<MeetupSearch.Response> {
    return await this.meetupRepository.findMeetupByTitle(email);
  }

  async findMeetupById(id: number): Promise<MeetupSearch.Response> {
    return await this.meetupRepository.findMeetupById(id);
  }

  async updateMeetup(
    id: number,
    meetupUpdate: MeetupUpdate.Request,
    userId: number,
  ): Promise<MeetupUpdate.Response> {
    const meetup = await this.findMeetupById(id);
    if (meetup.createdById !== userId) {
      throw new RpcException(new ConflictException(ACCESS_DENIED_ERROR));
    }

    if (meetupUpdate.title !== meetup.title) {
      meetup.title = meetupUpdate.title;
    }

    meetup.description = meetupUpdate.description;
    meetup.latitude = meetupUpdate.latitude;
    meetup.longitude = meetupUpdate.longitude;
    meetup.meetingTime = meetupUpdate.meetingTime;
    meetup.tags = meetupUpdate.tags;

    this.meetupsSearchModule.removeIndex(id);
    this.meetupsSearchModule.indexMeetup(meetup);
    return await this.meetupRepository.update(id, meetup);
  }

  async deleteMeetup(
    id: number,
    userId: number,
  ): Promise<MeetupDelete.Response> {
    const meetup = await this.findMeetupById(id);

    if (!meetup) {
      throw new RpcException(new ConflictException(MEETUP_NOT_FOUND_ERROR));
    }
    if (meetup.createdById !== userId) {
      throw new RpcException(new ConflictException(ACCESS_DENIED_ERROR));
    }
    this.meetupsSearchModule.removeIndex(id);
    return await this.meetupRepository.remove(id);
  }

  async findAllMeetupsElastic(searchDto: MeetupSearch.MeetupSearchDto) {
    return this.meetupsSearchModule.search(searchDto.query);
  }
}
