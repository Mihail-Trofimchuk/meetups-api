import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

import {
  UserMeetupAddUser,
  UserMeetupDeleteUser,
  UserSearch,
} from '@app/contracts';
import {
  USER_ALREADY_ADD_ERROR,
  USER_NOT_FOUND_ERROR,
} from './user-meetup.constants';
import { UserMeetupRepository } from './user-meetup.repository';

@Injectable()
export class UserMeetupService {
  constructor(
    private readonly userMeetupRepository: UserMeetupRepository,
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findUserIdByEmail(email: string): Promise<number> {
    const userId = await firstValueFrom(
      this.client.send({ cmd: UserSearch.findOneByEmailTopic }, email),
    );
    return userId;
  }

  async addUserToMeetup(
    addUserdto: UserMeetupAddUser.Request,
  ): Promise<UserMeetupAddUser.Response> {
    const userId = await this.findUserIdByEmail(addUserdto.email);

    const existingUserMeetup = await this.userMeetupRepository.findUserMeetup(
      addUserdto.meetupId,
      userId,
    );

    if (existingUserMeetup) {
      throw new RpcException(new ConflictException(USER_ALREADY_ADD_ERROR));
    }

    return await this.userMeetupRepository.addUserToMeetup(
      addUserdto.meetupId,
      userId,
    );
  }

  async deleteUserFromMeetup(
    deleteUserdto: UserMeetupDeleteUser.Request,
  ): Promise<UserMeetupDeleteUser.Response> {
    const userId = await this.findUserIdByEmail(deleteUserdto.email);

    const existingUserMeetup = await this.userMeetupRepository.findUserMeetup(
      deleteUserdto.meetupId,
      userId,
    );

    if (!existingUserMeetup) {
      throw new RpcException(new NotFoundException(USER_NOT_FOUND_ERROR));
    }

    return this.userMeetupRepository.deleteUserFromMeetup(
      deleteUserdto.meetupId,
      userId,
    );
  }
}
