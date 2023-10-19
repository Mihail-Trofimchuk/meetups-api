import { Meetup, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import { Request } from 'express';

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
import { ApiProperty } from '@nestjs/swagger';

type MeetupCreateType = Omit<Meetup, 'id' | 'createdById'>;

export namespace MeetupCreate {
  export const topic = 'meetup.create.command';

  export interface RequestWithUser extends Request {
    user: User;
  }

  export class MeetupRequest implements MeetupCreateType {
    @ApiProperty()
    @MaxLength(50)
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @MaxLength(200)
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    tags: string[];

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    meetingTime: Date;

    @ApiProperty({ type: Decimal })
    @IsNumber()
    @IsNotEmpty()
    @Min(-90)
    @Max(90)
    latitude: Decimal;

    @ApiProperty({ type: Decimal })
    @IsNumber()
    @IsNotEmpty()
    @Min(-180)
    @Max(180)
    longitude: Decimal;
  }

  export class UserRequest {
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
