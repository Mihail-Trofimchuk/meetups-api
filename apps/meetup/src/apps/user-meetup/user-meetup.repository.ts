import { Injectable } from '@nestjs/common';

import { DbService } from '@app/db';
import { UserMeetupAddUser, UserMeetupDeleteUser } from '@app/contracts';

@Injectable()
export class UserMeetupRepository {
  constructor(private readonly dbService: DbService) {}

  async findUserMeetup(meetupId: number, userId: number) {
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
  ): Promise<UserMeetupAddUser.Response> {
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
  ): Promise<UserMeetupDeleteUser.Response> {
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
