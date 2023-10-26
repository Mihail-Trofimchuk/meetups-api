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
import { MeetupTag, Tag } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

type TagsType = Omit<MeetupTag, 'meetupId'>;

export class MeetupTags implements TagsType {
  @ApiProperty()
  @IsNumber()
  tagId: number;
}

export class MeetupsTagsResponse {
  tag: TagsResponse;
}

export class TagsResponse implements Tag {
  id: number;
  name: string;
}

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
    tags: MeetupTags[];

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

    tags: MeetupsTagsResponse[];

    meetingTime: Date;

    latitude: Decimal;

    longitude: Decimal;

    createdById: number;
  }
}
