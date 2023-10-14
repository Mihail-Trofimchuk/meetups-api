import { IsEmail } from 'class-validator';

export namespace UserCreateOrganizer {
  export const topic = 'user.create-organizer.command';

  export class Request {
    @IsEmail()
    email: string;
  }
}
