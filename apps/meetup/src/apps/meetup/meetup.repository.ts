import { Injectable } from '@nestjs/common';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupTags,
  MeetupUpdate,
} from '@app/contracts';
import { DbService } from '@app/db';

@Injectable()
export class MeetupRepository {
  constructor(private readonly dbService: DbService) {}

  private meetupfullSelect = {
    id: true,
    title: true,
    description: true,
    tags: {
      select: {
        tag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    meetingTime: true,
    latitude: true,
    longitude: true,
    participants: true,
    createdById: true,
  };

  public async create(
    createContract: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    const { tags, ...rest } = createContract;
    return await this.dbService.meetup.create({
      data: {
        tags: { createMany: { data: tags } },
        ...rest,
      },
      select: this.meetupfullSelect,
    });
  }

  public async findAll(): Promise<MeetupSearch.Response[]> {
    return await this.dbService.meetup.findMany({
      select: this.meetupfullSelect,
    });
  }

  public async findMeetupByTitle(
    title: string,
  ): Promise<MeetupSearch.Response> {
    return await this.dbService.meetup.findFirst({
      where: { title },
      select: this.meetupfullSelect,
    });
  }

  public async findMeetupById(id: number): Promise<MeetupSearch.Response> {
    return await this.dbService.meetup.findFirst({
      where: { id },
      select: this.meetupfullSelect,
    });
  }

  public async update(
    meetupId: number,
    updateDto,
    tag: MeetupTags[],
  ): Promise<MeetupUpdate.Response> {
    delete updateDto.tags;
    delete updateDto.participants;
    const { ...rest } = updateDto;

    await this.dbService.meetupTag.deleteMany({
      where: { meetupId: meetupId },
    });

    return await this.dbService.meetup.update({
      where: { id: meetupId },
      data: { tags: { createMany: { data: tag } }, ...rest },
      select: this.meetupfullSelect,
    });
  }

  public async remove(id: number): Promise<MeetupDelete.Response> {
    return await this.dbService.meetup.delete({
      where: { id },
      select: this.meetupfullSelect,
    });
  }
}
