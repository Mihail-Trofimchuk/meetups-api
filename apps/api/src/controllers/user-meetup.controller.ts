import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Observable } from 'rxjs';

import { UserMeetupService } from '../services/user-meetup.service';
import { UserMeetupAddDto } from '../dtos/user-meetup/add-user-meetup.dto';
import { UserMeetupDeleteDto } from '../dtos/user-meetup/delete-user-meetup.dto';
import { UserMeetupAddResponse } from '../response/user-meetup/add-user-meetup.response';
import { UserMeetupDeleteResponse } from '../response/user-meetup/delete-user-meetup.response';
import { UserMeetupFindAllDto } from '../dtos/user-meetup/search-user-meetup.dto';
import { UserMeetupSearchResponse } from '../response/user-meetup/search-user-meetup.response';

@ApiTags('user-meetups')
@Controller('user-meetups')
export class UserMeetupController {
  constructor(private readonly userMeetupService: UserMeetupService) {}

  @Get('csv-report')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="meetups.csv"')
  async generateCSV(
    @Body() findUserMeetupsDto: UserMeetupFindAllDto,
  ): Promise<StreamableFile> {
    const output = await this.userMeetupService.generateCSV(findUserMeetupsDto);
    return new StreamableFile(output);
  }

  @Get('meetups')
  async findAllUserMeetups(
    @Body() findUserMeetupsDto: UserMeetupFindAllDto,
  ): Promise<Observable<UserMeetupSearchResponse[]>> {
    return this.userMeetupService.findAllUserMeetups(findUserMeetupsDto);
  }

  @Post()
  async addUserToMeetup(
    @Body() addUserDto: UserMeetupAddDto,
  ): Promise<Observable<UserMeetupAddResponse>> {
    return this.userMeetupService.addUserToMeetup(addUserDto);
  }

  @Delete()
  async deleteUserFromMeetup(
    @Body() deleteUserDto: UserMeetupDeleteDto,
  ): Promise<Observable<UserMeetupDeleteResponse>> {
    return this.userMeetupService.deleteUserFromMeetup(deleteUserDto);
  }
}
