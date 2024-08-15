import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryEpxensesDto {
  @ApiProperty({
    default: '12',
  })
  @IsNotEmpty()
  @IsString()
  limit: string;

  @ApiProperty({
    default: '1',
  })
  @IsNotEmpty()
  @IsString()
  page: string;
}
