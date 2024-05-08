import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../auth/dto';

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '662a8b0dd52cd2e44087a698',
  })
  _id: string;

  constructor(body: UpdateUserDto) {
    super(body);
    this._id = body?._id;
  }
}
