import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    default: '663b9dd2606f2f340dcee6d3',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    default: 'some string value',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    default: 'some string value',
  })
  @IsNotEmpty()
  @IsString()
  currencyId: string;

  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    default: 'some kind of comment',
  })
  @IsString()
  details: string;
}
