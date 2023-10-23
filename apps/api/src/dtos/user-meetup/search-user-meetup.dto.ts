import { ApiProperty } from '@nestjs/swagger';

import { IsEmail } from 'class-validator';

export class UserMeetupFindAllDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
