import { ApiProperty } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';

import { Decimal } from '@prisma/client/runtime/library';
import { MeetupTags } from '@app/contracts';
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
  ValidateNested,
} from 'class-validator';

export class MeetupCreateDto {
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

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MeetupTags)
  tags: MeetupTags[];

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
