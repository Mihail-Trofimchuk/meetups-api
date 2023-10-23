import { IsEmail } from 'class-validator';

export class UserCreateOrganizerDto {
  @IsEmail()
  email: string;
}
