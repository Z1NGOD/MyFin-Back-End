import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class DraftExpenseDto {
  @ApiProperty({
    default: '663b9dd2606f2f340dcee6d3',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    default: 'some kind of category id',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    default: 'some kind of currency id',
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
    default: new Date(),
  })
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    default: 'some kind of comment',
  })
  @IsString()
  @MaxLength(15)
  details: string;
}
