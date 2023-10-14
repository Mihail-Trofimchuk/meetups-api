import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserMeetupAddUser, UserMeetupDeleteUser } from '@app/contracts';
import { UserMeetupService } from './user-meetup.service';

@Controller()
export class UserMeetupController {
  constructor(private readonly userMeetupService: UserMeetupService) {}

  @MessagePattern({ cmd: UserMeetupAddUser.topic })
  async addUserToMeetup(@Payload() addUserdto: UserMeetupAddUser.Request) {
    return this.userMeetupService.addUserToMeetup(addUserdto);
  }

  @MessagePattern({ cmd: UserMeetupDeleteUser.topic })
  async deleteUserFromMeetup(
    @Payload() deleteUserdto: UserMeetupDeleteUser.Request,
  ) {
    return this.userMeetupService.deleteUserFromMeetup(deleteUserdto);
  }
}
