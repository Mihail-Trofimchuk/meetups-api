import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { MeetupService } from '../services/meetup.service';
import { MeetupCreate, MeetupUpdate } from '@app/contracts';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Post()
  async createMeetup(@Body() createDto: MeetupCreate.Request) {
    return this.meetupService.createMeetup(createDto);
  }

  @Get()
  async findAllMeetups() {
    return this.meetupService.findAllMeetups();
  }

  @Patch(':id')
  async updateMeetup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: MeetupUpdate.Request,
  ) {
    return this.meetupService.updateMeetup(id, updateDto);
  }

  @Delete(':id')
  async deleteMeetup(@Param('id') id: string) {
    return this.meetupService.deleteMeetup(Number(id));
  }
}
