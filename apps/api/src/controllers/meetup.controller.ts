import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';

import { MeetupCreate, MeetupUpdate } from '@app/contracts';

import { MeetupService } from '../services/meetup.service';
import { EmailConfirmationGuard } from '../guards/emailConfirmation.guard';
import { MeetupFilterDto } from '../dtos/meetups-filter.dto';
import RoleGuard from '../guards/role.guard';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseGuards(RoleGuard(Role.ORGANIZER))
  @Post()
  async createMeetup(@Body() createDto: MeetupCreate.Request, @Req() request) {
    return this.meetupService.createMeetup(createDto, request.user.user.id);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER))
  @Patch(':id')
  async updateMeetup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: MeetupUpdate.Request,
  ) {
    return this.meetupService.updateMeetup(id, updateDto);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER))
  @Delete(':id')
  async deleteMeetup(@Param('id') id: string) {
    return this.meetupService.deleteMeetup(Number(id));
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER))
  @Get()
  async findAllMeetups() {
    return this.meetupService.findAllMeetups();
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER))
  @Get('filter')
  async getMeetups(@Query() filterDto: MeetupFilterDto) {
    return this.meetupService.findMeetupsInRadius(filterDto);
  }

  @Get('csv-report')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="meetups.csv"')
  async generateCSV() {
    const output = await this.meetupService.generateCSV();
    return new StreamableFile(output);
  }
}
