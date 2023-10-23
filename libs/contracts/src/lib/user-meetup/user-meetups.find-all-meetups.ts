import { IsEmail } from 'class-validator';

export namespace UserMeetupFindAll {
  export const Topic = 'user-meetup.find-all-meetups.command';

  export class Request {
    @IsEmail()
    email: string;
  }

  export class Response {
    userId: number;

    meetupId: number;
  }
}
