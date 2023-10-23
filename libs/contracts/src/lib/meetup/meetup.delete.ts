import { Decimal } from '@prisma/client/runtime/library';
import { IsNumber } from 'class-validator';

export namespace MeetupDelete {
  export const Topic = 'meetup.delete.command';

  export class Request {
    @IsNumber()
    meetupId: number;

    @IsNumber()
    userId: number;
  }

  export class Response {
    id: number;

    title: string;

    description: string;

    tags: string[];

    meetingTime: Date;

    latitude: Decimal;

    longitude: Decimal;

    createdById: number;
  }
}
