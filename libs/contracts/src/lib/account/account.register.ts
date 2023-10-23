import { IsEmail, IsOptional, IsString } from 'class-validator';

export namespace AccountRegister {
  export const Topic = 'account.register.command';

  export class Request {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    displayName?: string;
  }

  export class Response {
    id: number;
    email: string;
    displayName?: string;
    passwordHash: string;
  }
}
