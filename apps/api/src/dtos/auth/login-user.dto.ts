import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'Strong email with numbers',
    type: String,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    minimum: 4,
    maximum: 20,
    type: String,
  })
  @IsString()
  password: string;
}
