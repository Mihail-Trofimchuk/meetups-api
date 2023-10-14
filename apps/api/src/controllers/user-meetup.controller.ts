import { Body, Controller, Delete, Post } from '@nestjs/common';
import { UserMeetupService } from '../services/user-meetup.service';
import { UserMeetupAddUser, UserMeetupDeleteUser } from '@app/contracts';
import { Observable } from 'rxjs';

@Controller('user-meetups')
export class UserMeetupController {
  constructor(private readonly userMeetupService: UserMeetupService) {}

  @Post()
  async addUserToMeetup(
    @Body() addUserdto: UserMeetupAddUser.Request,
  ): Promise<Observable<Promise<UserMeetupAddUser.Response>>> {
    return this.userMeetupService.addUserToMeetup(addUserdto);
  }

  @Delete()
  async deleteUserFromMeetup(
    @Body() deleteUserdto: UserMeetupDeleteUser.Request,
  ): Promise<Observable<Promise<UserMeetupDeleteUser.Response>>> {
    return this.userMeetupService.deleteUserFromMeetup(deleteUserdto);
  }
}
