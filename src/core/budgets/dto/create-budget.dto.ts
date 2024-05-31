import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BudgetType } from '../enum/budget.enum';

export class CreateBudgetDto {
  @ApiProperty({ default: 'someString' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ default: 'someString' })
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
