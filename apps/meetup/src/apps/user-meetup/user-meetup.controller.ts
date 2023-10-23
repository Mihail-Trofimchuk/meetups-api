import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserMeetupService } from './user-meetup.service';
import {
  UserMeetupAdd,
  UserMeetupDelete,
  UserMeetupFindAll,
} from '@app/contracts';

@Controller()
export class UserMeetupController {
  constructor(private readonly userMeetupService: UserMeetupService) {}

  @MessagePattern({ cmd: UserMeetupFindAll.Topic })
  async findAllUserMeetups(
    @Payload() findUserMeetupsDto: UserMeetupFindAll.Request,
  ): Promise<UserMeetupFindAll.Response[]> {
    return this.userMeetupService.findAllUsersMeetup(findUserMeetupsDto.email);
  }

  @MessagePattern({ cmd: UserMeetupAdd.Topic })
  async addUserToMeetup(
    @Payload() addUserdto: UserMeetupAdd.Request,
  ): Promise<UserMeetupAdd.Response> {
    return this.userMeetupService.addUserToMeetup(addUserdto);
  }

  @MessagePattern({ cmd: UserMeetupDelete.Topic })
  async deleteUserFromMeetup(
    @Payload() deleteUserdto: UserMeetupDelete.Request,
  ): Promise<UserMeetupDelete.Response> {
    return this.userMeetupService.deleteUserFromMeetup(deleteUserdto);
  }
}
