import { MeetupCreate } from './meetup.create';
import { PartialType } from '@nestjs/mapped-types';

export namespace MeetupUpdate {
  export const topic = 'meetup.update.command';

  export class Request extends PartialType(MeetupCreate.Request) {}

  export class Response extends PartialType(MeetupCreate.Response) {}
}
