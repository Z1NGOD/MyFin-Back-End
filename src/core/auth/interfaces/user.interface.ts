import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestUser {
  @IsNotEmpty()
  @ApiProperty({
    default: '223b9d12606j2f3k0dsse6d3',
  })
  id: string;
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    default: 'Teapot@gmail.com',
  })
  email: string;
}
