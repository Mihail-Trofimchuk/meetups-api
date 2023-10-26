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
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import { Observable } from 'rxjs';

import { Role } from '@prisma/client';
import { MeetupRequestUser } from '@app/interfaces';

import { MeetupService } from '../services/meetup.service';
import { EmailConfirmationGuard } from '../guards/emailConfirmation.guard';
import { MeetupFilterDto } from '../dtos/meetups-filter.dto';
import RoleGuard from '../guards/role.guard';
import { MeetupCreateDto } from '../dtos/meetup/create-meetup.dto';
import { CreateResponse } from '../response/meetup/create-meetup.response';
import { MeetupUpdateDto } from '../dtos/meetup/update-meetup.dto';
import { UpdateResponse } from '../response/meetup/update-meetup.response';
import { DeleteResponse } from '../response/meetup/delete-meetup.response';
import { SearchResponse } from '../response/meetup/search-meetup.response';
import { MeetupSearchDto } from '../dtos/meetup/search-meetup.dto';

@ApiTags('meetup')
@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseGuards(RoleGuard(Role.ORGANIZER))
  @Post()
  async createMeetup(
    @Body() dto: MeetupCreateDto,
    @Req() { user }: MeetupRequestUser,
  ): Promise<Observable<CreateResponse>> {
    return await this.meetupService.createMeetup(dto, user.id);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Patch(':id')
  async updateMeetup(
    @Param('id', ParseIntPipe) meetupId: number,
    @Body() dto: MeetupUpdateDto,
    @Req() { user }: MeetupRequestUser,
  ): Promise<Observable<UpdateResponse>> {
    return this.meetupService.updateMeetup(meetupId, dto, user.id);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Delete(':id')
  async deleteMeetup(
    @Param('id') id: string,
    @Req() { user }: MeetupRequestUser,
  ): Promise<Observable<DeleteResponse>> {
    return this.meetupService.deleteMeetup(Number(id), user.id);
  }

  @UseGuards(EmailConfirmationGuard)
  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get()
  async findAllMeetups(): Promise<Observable<SearchResponse[]>> {
    return this.meetupService.findAllMeetups();
  }

  @ApiQuery({
    name: 'filterDto',
    required: false,
    type: MeetupFilterDto,
  })
  @UseGuards(RoleGuard(Role.PARTICIPANT, Role.ORGANIZER, Role.ADMIN))
  @Get('filter')
  async getMeetups(
    @Query() filterDto: MeetupFilterDto,
  ): Promise<Observable<SearchResponse[]>> {
    return this.meetupService.findMeetupsInRadius(filterDto);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN))
  @Get('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="meetups.pdf"')
  async generatePdf(@Res() res: Response) {
    const buffer = await this.meetupService.generarPDF();

    res.header({ 'Content-Length': buffer.length });
    res.send(buffer);
  }

  @UseGuards(RoleGuard(Role.ORGANIZER, Role.ADMIN, Role.PARTICIPANT))
  @ApiQuery({
    name: 'searchDto',
    required: false,
    type: MeetupSearchDto,
  })
  @Get('elastic')
  async searchMeetupsElastic(
    @Query() searchDto: MeetupSearchDto,
  ): Promise<Observable<SearchResponse[]>> {
    return this.meetupService.findMeetupsWithElastic(searchDto);
  }
}
