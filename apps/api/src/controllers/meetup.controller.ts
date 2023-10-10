import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { MeetupCreate, MeetupUpdate } from '@app/contracts';

import { MeetupService } from '../services/meetup.service';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { EmailConfirmationGuard } from '../guards/emailConfirmation.guard';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMeetup(@Body() createDto: MeetupCreate.Request) {
    return this.meetupService.createMeetup(createDto);
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(JwtAuthGuard)
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
