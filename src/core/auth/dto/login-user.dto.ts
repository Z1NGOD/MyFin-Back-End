import { IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty({
    default: 'Yaroslav@gmail.com',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    default: 'Q*123qweqwe123',
  })
  @IsStrongPassword()
  password: string;
}
