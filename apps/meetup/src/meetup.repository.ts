import { MeetupCreate, MeetupUpdate } from '@app/contracts';
import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetupRepository {
  constructor(private readonly dbService: DbService) {}

  public async create(
    createDto: MeetupCreate.Request,
  ): Promise<MeetupCreate.Response> {
    return await this.dbService.meetup.create({
      data: createDto,
    });
  }

  public async findAll() {
    return await this.dbService.meetup.findMany();
  }

  public async findMeetupByTitle(title: string) {
    return await this.dbService.meetup.findFirst({ where: { title } });
  }

  public async update(
    id: number,
    updateDto: MeetupUpdate.Request,
  ): Promise<MeetupUpdate.Response> {
    console.log(id);
    return await this.dbService.meetup.update({
      where: { id: id },
      data: updateDto,
    });
  }

  public async remove(id: number) {
    return await this.dbService.meetup.delete({ where: { id: id } });
  }
}