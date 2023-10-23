import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNumber } from 'class-validator';

export class UserMeetupAddDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  meetupId: number;
}
