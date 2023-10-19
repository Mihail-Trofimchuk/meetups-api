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

import {
  MeetupCreate,
  MeetupDelete,
  MeetupSearch,
  MeetupUpdate,
} from '@app/contracts';

import { MeetupService } from '../services/meetup.service';
import { EmailConfirmationGuard } from '../guards/emailConfirmation.guard';
import { MeetupFilterDto } from '../dtos/meetups-filter.dto';
import RoleGuard from '../guards/role.guard';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseGuards(RoleGuard(Role.ORGANIZER))
  @Post()
  async createMeetup(
    @Body() createDto: MeetupCreate.MeetupRequest,
    @Req() { user }: MeetupCreate.RequestWithUser,
  ): Promise<Observable<MeetupCreate.Response>> {
    return await this.meetupService.createMeetup(createDto, user.id);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Patch(':id')
  async updateMeetup(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: MeetupUpdate.Request,
    @Req() { user }: MeetupCreate.RequestWithUser,
  ): Promise<Observable<MeetupUpdate.Response>> {
    return this.meetupService.updateMeetup(id, updateDto, user.id);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Delete(':id')
  async deleteMeetup(
    @Param('id') id: string,
    @Req() { user }: MeetupCreate.RequestWithUser,
  ): Promise<Observable<MeetupDelete.Response>> {
    return this.meetupService.deleteMeetup(Number(id), user.id);
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get()
  async findAllMeetups(): Promise<Observable<MeetupSearch.Response[]>> {
    return this.meetupService.findAllMeetups();
  }

  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get('filter')
  async getMeetups(
    @Query() filterDto: MeetupFilterDto,
  ): Promise<Observable<MeetupSearch.Response[]>> {
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

  @Get('elastic')
  async searchMeetupsElastic(
    @Query() searchDto: MeetupSearch.MeetupSearchDto,
  ): Promise<Observable<MeetupSearch.Response[]>> {
    return this.meetupService.findMeetupsWithElastic(searchDto);
  }
}
