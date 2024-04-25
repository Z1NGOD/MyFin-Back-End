import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginUserDto, CreateUserDto } from '../dto';

@Injectable()
export class AuthService {
  registration(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new BadRequestException('Bad request');
    }
    return createUserDto;
  }

  login(loginUserDto: LoginUserDto) {
    if (!loginUserDto) {
      throw new BadRequestException('Bad request');
    }
    return loginUserDto;
  }
}
