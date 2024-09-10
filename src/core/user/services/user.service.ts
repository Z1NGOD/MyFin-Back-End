import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@libs/db';
import { PasswordService } from '@libs/security';
import { CreateUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    const isPasswordCorrect = await this.passwordService.scryptVerify(
      updateUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong password');
    }
    if (updateUserDto.newPassword) {
      updateUserDto.password = await this.passwordService.scryptHash(
        updateUserDto.newPassword,
      );
    }

    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.remove(id);
  }
}
