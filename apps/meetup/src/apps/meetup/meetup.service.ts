import { ConflictException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupTags,
  MeetupUpdate,
} from '@app/contracts';

import { MeetupsSearchService } from '../meetups-search/meetups-search.service';
import { ERROR_MESSAGES } from './meetup.constants';
import { MeetupRepository } from './meetup.repository';
import { TagService } from '../tag/tag.service';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly meetupsSearchModule: MeetupsSearchService,
    private readonly tagService: TagService,
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

    await this.checkIfTagsExist(createContract.tags);
    await this.checkForDuplicateTags(createContract.tags);

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

    await this.checkIfTagsExist(meetupUpdate.tags);
    await this.checkForDuplicateTags(meetupUpdate.tags);

    if (meetupUpdate.title !== meetup.title) {
      meetup.title = meetupUpdate.title;
    }
    meetup.description = meetupUpdate.description;
    meetup.latitude = meetupUpdate.latitude;
    meetup.longitude = meetupUpdate.longitude;
    meetup.meetingTime = meetupUpdate.meetingTime;

    const tags = await this.tagService.findAllTagById(meetupUpdate.tags);

    meetup.tags = tags.map((tag) => ({ tag }));

    await this.meetupsSearchModule.updateIndexMeetup(meetup);

    return await this.meetupRepository.update(
      meetupId,
      meetup,
      meetupUpdate.tags,
    );
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
    //@ts-expect-error ...
    return this.meetupsSearchModule.search(searchDto.query);
  }

  private hasUniqueTagIds(arr) {
    const seenTagIds = new Set();

    for (const element of arr) {
      if (seenTagIds.has(element.tagId)) {
        return false;
      }
      seenTagIds.add(element.tagId);
    }

    return true;
  }

  private async checkForDuplicateTags(tags: MeetupTags[]) {
    if (!this.hasUniqueTagIds(tags)) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.MEETUP_TAGS_DUBLICATE_EXISTS),
      );
    }
  }

  private async checkIfTagsExist(tags: MeetupTags[]) {
    for (const tag of tags) {
      const existTag = await this.tagService.searchTagById(tag.tagId);
      if (!existTag) {
        throw new RpcException(
          new ConflictException(ERROR_MESSAGES.MEETUP_TAG_NOT_FOUND_ERROR),
        );
      }
    }
  }
}
