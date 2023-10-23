import { MeetupCreate } from '@app/contracts';
import { IsNumber, IsString } from 'class-validator';

export namespace MeetupSearch {
  export const FindAllMeetupsTopic = 'meetup.findAllMeetupsTopic.command';
  export const FindAllMeetupsElasticTopic =
    'meetup.findAllMeetupsElasticTopic.command';

  export class Request {
    @IsNumber()
    meetupId: number;

    @IsNumber()
    userId: number;
  }

  export class ElasticQuery {
    @IsString()
    query: string;
  }

  export class Response extends MeetupCreate.Response {}
}
