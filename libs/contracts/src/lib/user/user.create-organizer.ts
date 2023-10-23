import { $Enums } from '@prisma/client';
import { IsEmail } from 'class-validator';

export namespace UserCreateOrganizer {
  export const Topic = 'user.create-organizer.command';

  export class Request {
    @IsEmail()
    email: string;
  }

  export class Response {
    id: number;

    email: string;

    role: $Enums.Role;
  }
}
