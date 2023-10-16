import { Meetup } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';

import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinDate,
} from 'class-validator';

type MeetupCreateType = Omit<Meetup, 'id' | 'createdById'>;

export namespace MeetupCreate {
  export const topic = 'meetup.create.command';

  export class Request implements MeetupCreateType {
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    title: string;

    @MaxLength(200)
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    tags: string[];

    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    meetingTime: Date;

    @IsNumber()
    @IsNotEmpty()
    @Min(-90)
    @Max(90)
    latitude: Decimal;

    @IsNumber()
    @IsNotEmpty()
    @Min(-180)
    @Max(180)
    longitude: Decimal;
  }

  export class Response {
    id: number;

    title: string;

    description: string;

    tags: string[];

    meetingTime: Date;

    latitude: Decimal;

    longitude: Decimal;
  }
}
