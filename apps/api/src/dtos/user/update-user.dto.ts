import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
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
