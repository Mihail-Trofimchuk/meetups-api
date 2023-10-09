import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export namespace UserUpdate {
  export const topic = 'user.update.command';

  export class Request {
    @IsOptional()
    @IsString()
    displayName?: string;

    @IsString()
    password: string;
  }

  export class Response {
    @IsNumber()
    id: number;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    displayName?: string;

    @IsString()
    password: string;
  }
}
