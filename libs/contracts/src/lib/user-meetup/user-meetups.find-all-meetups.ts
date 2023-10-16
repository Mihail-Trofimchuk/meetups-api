import { IsEmail } from 'class-validator';

export namespace UserMeetupFindAll {
  export const topic = 'user-meetup.find-all-meetups.command';

  export class Request {
    @IsEmail()
    email: string;
  }
}
