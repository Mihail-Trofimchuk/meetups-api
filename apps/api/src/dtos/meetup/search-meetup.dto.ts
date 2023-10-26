import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class MeetupSearchDto {
  @ApiProperty()
  @IsString()
  query: string;
}
