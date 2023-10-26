import { MeetupCreate } from '@app/contracts';
import { IsNumber } from 'class-validator';

export namespace MeetupDelete {
  export const Topic = 'meetup.delete.command';

  export class Request {
    @IsNumber()
    meetupId: number;

    @IsNumber()
    userId: number;
  }

  export class Response extends MeetupCreate.Response {}
}
