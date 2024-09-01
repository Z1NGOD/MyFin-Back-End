import { Exclude } from 'class-transformer';

export class UserEntity {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
