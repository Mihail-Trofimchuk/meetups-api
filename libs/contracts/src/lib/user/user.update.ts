import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export namespace UserUpdate {
  export const topic = 'user.update.command';

  export class Request {
    @IsOptional()
    @IsString()
    displayName?: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })
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
