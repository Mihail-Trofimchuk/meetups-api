import { MeetupCreate } from '@app/contracts';
import { PartialType } from '@nestjs/mapped-types';

import { IsString } from 'class-validator';

export namespace MeetupSearch {
  export const findAllMeetupsTopic = 'meetup.findAllMeetupsTopic.command';
  export const findAllMeetupsElasticTopic =
    'meetup.findAllMeetupsElasticTopic.command';

  export class MeetupSearchDto {
    @IsString()
    query: string;
  }

  export class Response extends PartialType(MeetupCreate.Response) {}
}
