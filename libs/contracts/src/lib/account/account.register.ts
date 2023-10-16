import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })
    password: string;

    @IsOptional()
    @IsString()
    displayName?: string;
  }

  export class Response {
    email: string;
  }
}
