import { Meetup } from '@prisma/client';

export type MeetupCreateTypeWithoutId = Omit<Meetup, 'id'>;
export type MeetupCreateTypeWithoutBothIds = Omit<Meetup, 'id' | 'createdById'>;
