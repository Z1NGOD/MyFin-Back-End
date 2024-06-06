import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokensDto {
  @IsNotEmpty()
  @ApiProperty({
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjNlNWNhOGQ2MTE3OTM4ZMZ1ODVhYzciLCJlbWFpbCI6IlZsYSRAZ21haWwxLmNvbSIsImlhdCI2MTcxNTQ1NjA4OSwiZXhwIwdawdajoxNzE2MDYwODg5fQ.AaHdG7qL3CciSQI82lTLWM7MHhR43tKTgFoWEOuYtvY',
  })
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @ApiProperty({
    default:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjNlNWNhOGQ2MTE3OTM4ATZ9ODVhYzciLCJlbWFpbCI6IlZsYWRAZ21haWwxLmNvbSIsImlhdCI6MTcxNTQ1NjA4OSwiZXhwIwdawdajoxNzE2MDYwODg5fQ.AaHdG7qL3CciSQI82lTLWM7MHhR43tKTgFoWEOuYtvY',
  })
  @IsString()
  refreshToken: string;
}
