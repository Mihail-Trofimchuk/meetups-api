import { User } from '@prisma/client';
import { IsEmail, IsString } from 'class-validator';

export namespace AccountLogin {
  export const Topic = 'account.login.command';
  export const GetUserByRefreshTokenTopic =
    'account.get-user-by-refresh.command';
  export const UpdateUserByRefreshTokenTopic =
    'account.update-user-by-refresh.command';

  export class Request {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
  }

  export class Response {
    access_token: string;

    refresh_token: string;

    user: User;
  }
}
