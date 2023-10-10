import { IsDecimal, IsOptional } from 'class-validator';

export class MeetupFilterDto {
  @IsOptional()
  @IsDecimal()
  latitude: number;

  @IsOptional()
  @IsDecimal()
  longitude: number;

  @IsOptional()
  @IsDecimal()
  radius: number;
}
