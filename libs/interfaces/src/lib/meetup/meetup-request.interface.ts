import { User } from '@prisma/client';

export interface MeetupRequestUser extends Request {
  user: User;
}
