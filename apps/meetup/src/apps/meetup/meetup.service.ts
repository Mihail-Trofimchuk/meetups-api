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
import { ERROR_MESSAGES } from './meetup.constants';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly meetupsSearchModule: MeetupsSearchService,
  ) {}

  async createMeetup(
    createContract: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    const meetup = await this.meetupRepository.findMeetupByTitle(
      createContract.title,
    );

    if (meetup) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.MEETUP_ALREADY_EXISTS),
      );
    }

    const newMeetup = await this.meetupRepository.create(createContract);

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
    meetupUpdate: MeetupUpdate.Request,
    meetupId: number,
    userId: number,
  ): Promise<MeetupUpdate.Response> {
    const meetup = await this.findMeetupById(meetupId);
    if (meetup.createdById !== userId) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.ACCESS_DENIED_ERROR),
      );
    }

    if (meetupUpdate.title !== meetup.title) {
      meetup.title = meetupUpdate.title;
    }

    meetup.description = meetupUpdate.description;
    meetup.latitude = meetupUpdate.latitude;
    meetup.longitude = meetupUpdate.longitude;
    meetup.meetingTime = meetupUpdate.meetingTime;
    meetup.tags = meetupUpdate.tags;

    this.meetupsSearchModule.removeIndex(meetupId);
    this.meetupsSearchModule.indexMeetup(meetup);
    return await this.meetupRepository.update(meetupId, meetup);
  }

  async deleteMeetup(
    deleteContract: MeetupDelete.Request,
  ): Promise<MeetupDelete.Response> {
    const meetup = await this.findMeetupById(deleteContract.meetupId);

    if (!meetup) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.MEETUP_NOT_FOUND_ERROR),
      );
    }
    if (meetup.createdById !== deleteContract.userId) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.ACCESS_DENIED_ERROR),
      );
    }
    this.meetupsSearchModule.removeIndex(deleteContract.meetupId);
    return await this.meetupRepository.remove(deleteContract.meetupId);
  }

  async findAllMeetupsElastic(
    searchDto: MeetupSearch.ElasticQuery,
  ): Promise<MeetupSearch.Response> {
    return this.meetupsSearchModule.search(searchDto.query);
  }
}
