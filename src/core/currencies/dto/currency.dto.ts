import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CurrencyDto {
  @ApiProperty({
    default: 'USD',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    default: '$',
  })
  @IsNotEmpty()
  @IsString()
  symbol: string;

  @ApiProperty({
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  exchangeRate: number;
}
