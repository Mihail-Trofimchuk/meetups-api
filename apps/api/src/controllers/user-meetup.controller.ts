import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  StreamableFile,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import {
  UserMeetupAddUser,
  UserMeetupDeleteUser,
  UserMeetupFindAll,
} from '@app/contracts';

import { UserMeetupService } from '../services/user-meetup.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user-meetups')
@Controller('user-meetups')
export class UserMeetupController {
  constructor(private readonly userMeetupService: UserMeetupService) {}

  @Get('csv-report')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="meetups.csv"')
  async generateCSV(@Body() findUserMeetupsDto: UserMeetupFindAll.Request) {
    const output = await this.userMeetupService.generateCSV(findUserMeetupsDto);
    return new StreamableFile(output);
  }

  @Get('meetups')
  async findallUserMeetups(
    @Body() findUserMeetupsDto: UserMeetupFindAll.Request,
  ) {
    return this.userMeetupService.findAllUserMeetups(findUserMeetupsDto);
  }

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
