import { Injectable } from '@nestjs/common';
// import { Model } from 'mongoose';
// import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@core/auth/dto';
import { User } from '@libs/db/models/user.schema';
import { UserRepository } from '@libs/db/repositories/user.repository';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  findOne(_id: string): Promise<User> {
    return this.userRepository.findOne(_id);
  }

  update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userRepository.update(_id, updateUserDto);
  }

  remove(_id: string) {
    return this.userRepository.remove(_id);
  }
}
