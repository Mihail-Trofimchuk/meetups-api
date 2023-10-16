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
  Res,
  UseGuards,
} from '@nestjs/common';

import { Role } from '@prisma/client';
import { Response } from 'express';

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
  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get()
  async findAllMeetups() {
    return this.meetupService.findAllMeetups();
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get('filter')
  async getMeetups(@Query() filterDto: MeetupFilterDto) {
    return this.meetupService.findMeetupsInRadius(filterDto);
  }

  //@UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="meetups.pdf"')
  async generatePdf(@Res() res: Response) {
    const buffer = await this.meetupService.generarPDF();

    res.header({ 'Content-Length': buffer.length });
    res.send(buffer);
  }
}
