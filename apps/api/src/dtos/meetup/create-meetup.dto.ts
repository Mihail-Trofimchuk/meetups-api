import { ApiProperty } from '@nestjs/swagger';

import { Transform } from 'class-transformer';

import { Decimal } from '@prisma/client/runtime/library';
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
