import { Expose, Type } from 'class-transformer';
import { UserEntity } from '../entity/user.entity';

export class LoginResponseDto {
  @Expose()
  @Type(() => UserEntity)
  user: UserEntity;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
