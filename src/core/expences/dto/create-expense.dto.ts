import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    default: '663b9dd2606f2f340dcee6d3',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    default: 'Food',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    default: '$',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    default: new Date(),
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    default: 'ATB',
  })
  @IsString()
  @MaxLength(15)
  details: string;
}
