import { Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

import { MeetupCreateTypeWithoutId } from '@app/types';

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

export namespace MeetupCreate {
  export const Topic = 'meetup.create.command';

  export class Request implements MeetupCreateTypeWithoutId {
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

    createdById: number;
  }

  export class MeetupCreateRequestId {
    id: number;
  }

  export class Response {
    id: number;

    title: string;

    description: string;

    tags: string[];

    meetingTime: Date;

    latitude: Decimal;

    longitude: Decimal;

    createdById: number;
  }
}
