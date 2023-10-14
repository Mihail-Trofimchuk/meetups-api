import { IsEmail, IsNumber } from 'class-validator';

export namespace UserMeetupAddUser {
  export const topic = 'user-meetup.add-user.command';

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
