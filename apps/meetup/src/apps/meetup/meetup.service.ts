import { ConflictException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { MeetupCreate, MeetupDelete, MeetupUpdate } from '@app/contracts';

import { MeetupRepository } from './meetup.repository';
import { MEETUP_ALREADY_EXISTS } from './meetup.constants';

@Injectable()
export class MeetupService {
  constructor(private readonly meetupRepository: MeetupRepository) {}

  async createMeetup(createDto: MeetupCreate.Request, createdById: number) {
    const meetup = await this.meetupRepository.findMeetupByTitle(
      createDto.title,
    );

    if (meetup) {
      throw new RpcException(new ConflictException(MEETUP_ALREADY_EXISTS));
    }

    return await this.meetupRepository.create(createDto, createdById);
  }

  async findAllMeetups() {
    return await this.meetupRepository.findAll();
  }

  async findMeetupByTitle(email: string) {
    return await this.meetupRepository.findMeetupByTitle(email);
  }

  async updateMeetup(id: number, meetupUpdate: MeetupUpdate.Request) {
    return await this.meetupRepository.update(id, meetupUpdate);
  }

  async deleteMeetup(deletedto: MeetupDelete.Request) {
    return await this.meetupRepository.remove(deletedto.id);
  }
}
