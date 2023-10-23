import { Injectable } from '@nestjs/common';

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';
import { DbService } from '@app/db';

@Injectable()
export class MeetupRepository {
  constructor(private readonly dbService: DbService) {}

  public async create(
    createContract: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    return await this.dbService.meetup.create({
      data: {
        ...createContract,
      },
    });
  }

  public async findAll(): Promise<MeetupSearch.Response[]> {
    return await this.dbService.meetup.findMany();
  }

  public async findMeetupByTitle(
    title: string,
  ): Promise<MeetupSearch.Response> {
    return await this.dbService.meetup.findFirst({ where: { title } });
  }

  public async findMeetupById(id: number): Promise<MeetupSearch.Response> {
    return await this.dbService.meetup.findFirst({ where: { id } });
  }

  public async update(
    meetupId: number,
    updateDto: MeetupUpdate.Request,
  ): Promise<MeetupUpdate.Response> {
    return await this.dbService.meetup.update({
      where: { id: meetupId },
      data: updateDto,
    });
  }

  public async remove(id: number): Promise<MeetupDelete.Response> {
    return await this.dbService.meetup.delete({ where: { id } });
  }
}
