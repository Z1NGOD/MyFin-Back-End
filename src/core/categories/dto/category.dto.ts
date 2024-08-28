import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    default: 'Food',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
