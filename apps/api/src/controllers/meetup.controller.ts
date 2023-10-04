import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MeetupService } from '../services/meetup.service';
import { MeetupCreate, MeetupUpdate } from '@app/contracts';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Request } from 'express';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createMeetup(@Body() createDto: MeetupCreate.Request) {
    return this.meetupService.createMeetup(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllMeetups(@Req() req: Request) {
    console.log(req.cookies);
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
