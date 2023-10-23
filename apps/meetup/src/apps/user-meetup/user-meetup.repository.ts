import { Injectable } from '@nestjs/common';

import { DbService } from '@app/db';
import {
  UserMeetupAdd,
  UserMeetupDelete,
  UserMeetupFindAll,
} from '@app/contracts';

@Injectable()
export class UserMeetupRepository {
  constructor(private readonly dbService: DbService) {}

  async findAllUserMeetups(
    userId: number,
  ): Promise<UserMeetupFindAll.Response[]> {
    return await this.dbService.userMeetup.findMany({
      include: {
        meetup: true,
      },
      where: {
        userId,
      },
    });
  }

  async findUserMeetup(
    meetupId: number,
    userId: number,
  ): Promise<UserMeetupFindAll.Response> {
    return await this.dbService.userMeetup.findUnique({
      where: {
        userId_meetupId: {
          userId,
          meetupId,
        },
      },
    });
  }

  async addUserToMeetup(
    meetupId: number,
    userId: number,
  ): Promise<UserMeetupAdd.Response> {
    return await this.dbService.userMeetup.create({
      data: {
        meetupId,
        userId,
      },
    });
  }

  async deleteUserFromMeetup(
    meetupId: number,
    userId: number,
  ): Promise<UserMeetupDelete.Response> {
    return await this.dbService.userMeetup.delete({
      where: {
        userId_meetupId: {
          userId,
          meetupId,
        },
      },
    });
  }
}
