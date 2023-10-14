import { IsEmail, IsNumber } from 'class-validator';

export namespace UserMeetupDeleteUser {
  export const topic = 'user-meetup.delete-user.command';

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
