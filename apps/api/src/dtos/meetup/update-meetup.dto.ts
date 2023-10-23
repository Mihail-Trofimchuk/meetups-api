import { PartialType } from '@nestjs/swagger';

import { MeetupCreateDto } from './create-meetup.dto';

export class MeetupUpdateDto extends PartialType(MeetupCreateDto) {}
