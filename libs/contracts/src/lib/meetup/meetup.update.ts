import { MeetupCreate } from '@app/contracts';

export namespace MeetupUpdate {
  export const topic = 'meetup.update.command';

  export class Request extends MeetupCreate.Request {}

  export class Response extends MeetupCreate.Response {}
}
