import {
  IsString,
  IsEmail,
  IsStrongPassword,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'Andy',
  })
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'DoUrden',
  })
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'Andy@gmail.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'Q*123qweqwe123',
  })
  @IsStrongPassword()
  password: string;

  constructor(body: CreateUserDto) {
    this.firstName = body?.firstName;
    this.lastName = body?.lastName;
    this.email = body?.email;
    this.password = body?.password;
  }
}
