import { IsEmail, IsNumber } from 'class-validator';

export namespace UserMeetupAdd {
  export const Topic = 'user-meetup.add-user.command';

  export class Request {
    @IsEmail()
    email: string;

    @IsNumber()
    meetupId: number;
  }

  export class Response {
    userId: number;

    meetupId: number;
  }
}
