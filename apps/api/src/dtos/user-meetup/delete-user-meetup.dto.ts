import { PartialType } from '@nestjs/swagger';

import { UserMeetupAddDto } from './add-user-meetup.dto';

export class UserMeetupDeleteDto extends PartialType(UserMeetupAddDto) {}
