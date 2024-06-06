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
    default: '6650d29a21f0205cce148ab4',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @ApiProperty({
    default: '6650cddc7cb8435306eb1a2e',
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
