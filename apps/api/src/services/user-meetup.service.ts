import { UserMeetupAddUser, UserMeetupDeleteUser } from '@app/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

const handleRpcError = (error) => {
  throw new RpcException(error.response);
};

@Injectable()
export class UserMeetupService {
  constructor(@Inject('MEETUP_SERVICE') private readonly client: ClientProxy) {}

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
