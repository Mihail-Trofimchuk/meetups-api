import { MeetupsTagsResponse } from '@app/contracts';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateResponse {
  id: number;

  title: string;

  description: string;

  tags: MeetupsTagsResponse[];

  meetingTime: Date;

  latitude: Decimal;

  longitude: Decimal;

  createdById: number;
}
