import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserRepository } from '../../../libs/db/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(_id: string) {
    return this.userRepository.findOne(_id);
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(_id, updateUserDto);
  }

  remove(_id: string) {
    return this.userRepository.remove(_id);
  }
}
