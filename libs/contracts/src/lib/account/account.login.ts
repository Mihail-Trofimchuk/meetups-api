import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString } from 'class-validator';

export namespace AccountLogin {
  export const topic = 'account.login.command';

  export class Request {
    @ApiProperty({
      description: 'Strong email with numbers',
      minimum: 4,
      maximum: 20,
      type: String,
      format: 'email',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
      description: 'Password',
      minimum: 4,
      maximum: 20,
      type: String,
    })
    @IsString()
    password: string;
  }

  export class Response {
    access_token: string;
  }
}
