import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsOptional } from 'class-validator';

export class MeetupFilterDto {
  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  latitude: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  longitude: number;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  radius: number;
}
