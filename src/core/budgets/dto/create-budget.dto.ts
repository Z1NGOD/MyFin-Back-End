import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BudgetType } from '../enum/budget.enum';

export class CreateBudgetDto {
  @ApiProperty({ default: '663b9dd2606f2f340dcee6d3' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ default: '6650cddc7cb8435306eb1a2e' })
  @IsNotEmpty()
  @IsString()
  currencyId: string;

  @ApiProperty({ default: 100 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: BudgetType })
  @IsNotEmpty()
  @IsString()
  type: BudgetType;
}
