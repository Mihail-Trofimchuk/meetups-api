import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';

import {
  UserMeetupAdd,
  UserMeetupDelete,
  UserMeetupFindAll,
  UserSearch,
} from '@app/contracts';
import { ERROR_MESSAGES } from './user-meetup.constants';
import { UserMeetupRepository } from './user-meetup.repository';
import { MeetupService } from '../meetup/meetup.service';
import { handleRpcError } from '../../filters/rpc.exception';

@Injectable()
export class UserMeetupService {
  constructor(
    private readonly userMeetupRepository: UserMeetupRepository,
    private readonly meetupService: MeetupService,
    @Inject('ACCOUNT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async findUserIdByEmail(email: string): Promise<number> {
    const userId = await firstValueFrom(
      this.client
        .send({ cmd: UserSearch.OneUserByEmailTopic }, email)
        .pipe(catchError(handleRpcError)),
    );
    return userId;
  }

  async findAllUsersMeetup(
    email: string,
  ): Promise<UserMeetupFindAll.Response[]> {
    const userId = await this.findUserIdByEmail(email);

    const meetups = await this.userMeetupRepository.findAllUserMeetups(userId);

    return meetups;
  }

  async addUserToMeetup(
    addUserdto: UserMeetupAdd.Request,
  ): Promise<UserMeetupAdd.Response> {
    const userId = await this.findUserIdByEmail(addUserdto.email);

    const meetup = await this.meetupService.findMeetupById(addUserdto.meetupId);
    if (!meetup) {
      throw new RpcException(
        new NotFoundException(ERROR_MESSAGES.MEETUP_NOT_FOUND),
      );
    }

    const existingUserMeetup = await this.userMeetupRepository.findUserMeetup(
      addUserdto.meetupId,
      userId,
    );

    if (existingUserMeetup) {
      throw new RpcException(
        new ConflictException(ERROR_MESSAGES.USER_ALREADY_ADD),
      );
    }

    return await this.userMeetupRepository.addUserToMeetup(
      addUserdto.meetupId,
      userId,
    );
  }

  async deleteUserFromMeetup(
    deleteUserdto: UserMeetupDelete.Request,
  ): Promise<UserMeetupDelete.Response> {
    const userId = await this.findUserIdByEmail(deleteUserdto.email);

    const meetup = await this.meetupService.findMeetupById(
      deleteUserdto.meetupId,
    );

    if (!meetup) {
      throw new RpcException(
        new NotFoundException(ERROR_MESSAGES.MEETUP_NOT_FOUND),
      );
    }
    const existingUserMeetup = await this.userMeetupRepository.findUserMeetup(
      deleteUserdto.meetupId,
      userId,
    );

    if (!existingUserMeetup) {
      throw new RpcException(
        new NotFoundException(ERROR_MESSAGES.USER_NOT_INCLUDE),
      );
    }

    return this.userMeetupRepository.deleteUserFromMeetup(
      deleteUserdto.meetupId,
      userId,
    );
  }
}
