import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { stringify } from 'csv-stringify';
import { Observable, catchError, firstValueFrom } from 'rxjs';

import {
  UserMeetupAdd,
  UserMeetupDelete,
  UserMeetupFindAll,
} from '@app/contracts';
import { handleRpcError } from '../filters/rpc.exception';
import { UserMeetupDeleteDto } from '../dtos/user-meetup/delete-user-meetup.dto';
import { UserMeetupAddDto } from '../dtos/user-meetup/add-user-meetup.dto';
import { UserMeetupDeleteResponse } from '../response/user-meetup/delete-user-meetup.response';
import { UserMeetupAddResponse } from '../response/user-meetup/add-user-meetup.response';
import { UserMeetupFindAllDto } from '../dtos/user-meetup/search-user-meetup.dto';
import { UserMeetupSearchResponse } from '../response/user-meetup/search-user-meetup.response';

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
      this.sendRCPRequest(UserMeetupFindAll.Topic, findUserMeetupsDto),
    );

    const meetupObjects = meetups.map((item) => item.meetup);

    const output = stringify(meetupObjects, { header: true, delimiter: ';' });

    return output;
  }

  async findAllUserMeetups(
    findUserMeetupsDto: UserMeetupFindAllDto,
  ): Promise<Observable<UserMeetupSearchResponse[]>> {
    return this.client
      .send({ cmd: UserMeetupFindAll.Topic }, findUserMeetupsDto)
      .pipe(catchError(handleRpcError));
  }

  async addUserToMeetup(
    addUserdto: UserMeetupAddDto,
  ): Promise<Observable<UserMeetupAddResponse>> {
    return this.client
      .send({ cmd: UserMeetupAdd.Topic }, addUserdto)
      .pipe(catchError(handleRpcError));
  }

  async deleteUserFromMeetup(
    deleteUserdto: UserMeetupDeleteDto,
  ): Promise<Observable<UserMeetupDeleteResponse>> {
    return this.client
      .send({ cmd: UserMeetupDelete.Topic }, deleteUserdto)
      .pipe(catchError(handleRpcError));
  }
}
