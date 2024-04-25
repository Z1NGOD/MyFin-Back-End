import { BadRequestException, Injectable } from '@nestjs/common';
import { CheckUserDto, CreateUserDto } from '../dto';

@Injectable()
export class AuthService {
  registration(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new BadRequestException('Bad request');
    }
    return createUserDto;
  }

  login(checkUserDto: CheckUserDto) {
    if (!checkUserDto) {
      throw new BadRequestException('Bad request');
    }
    return checkUserDto;
  }
}
