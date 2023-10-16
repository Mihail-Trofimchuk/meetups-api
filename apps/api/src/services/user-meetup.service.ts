import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { catchError, firstValueFrom } from 'rxjs';

import {
  UserMeetupAddUser,
  UserMeetupDeleteUser,
  UserMeetupFindAll,
} from '@app/contracts';

import { stringify } from 'csv-stringify';
import { handleRpcError } from '../filters/rpc.exception';

@Injectable()
export class UserMeetupService {
  private sendRCPRequest(command: string, data: any) {
    return this.client
      .send({ cmd: command }, data)
      .pipe(catchError(handleRpcError));
  }

  constructor(@Inject('MEETUP_SERVICE') private readonly client: ClientProxy) {}

  async generateCSV(findUserMeetupsDto: UserMeetupFindAll.Request) {
    const meetups = await firstValueFrom(
      this.sendRCPRequest(UserMeetupFindAll.topic, findUserMeetupsDto),
    );

    const meetupObjects = meetups.map((item) => item.meetup);

    const output = stringify(meetupObjects, { header: true, delimiter: ';' });

    return output;
  }

  async findAllUserMeetups(findUserMeetupsDto: UserMeetupFindAll.Request) {
    return this.client
      .send({ cmd: UserMeetupFindAll.topic }, findUserMeetupsDto)
      .pipe(catchError(handleRpcError));
  }

  async addUserToMeetup(addUserdto: UserMeetupAddUser.Request) {
    return this.client
      .send({ cmd: UserMeetupAddUser.topic }, addUserdto)
      .pipe(catchError(handleRpcError));
  }

  async deleteUserFromMeetup(deleteUserdto: UserMeetupDeleteUser.Request) {
    return this.client
      .send({ cmd: UserMeetupDeleteUser.topic }, deleteUserdto)
      .pipe(catchError(handleRpcError));
  }
}
