import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export namespace UserUpdate {
  export const Topic = 'user.update.command';

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
    id: number;

    email: string;

    displayName?: string;

    passwordHash: string;
  }
}
