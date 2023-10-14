import { Meetup } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

type MeetupCreateType = Omit<Meetup, 'id' | 'createdById'>;

export namespace MeetupCreate {
  export const topic = 'meetup.create.command';

  export class Request implements MeetupCreateType {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsArray()
    tags: string[];

    @IsDateString()
    meetingTime: Date;

    @IsNumber()
    latitude: Decimal;

    @IsNumber()
    longitude: Decimal;
  }

  export class Response {
    id: number;

    title: string;

    description: string;

    tags: string[];

    meetingTime: Date;

    latitude: Decimal;

    longitude: Decimal;
  }
}
