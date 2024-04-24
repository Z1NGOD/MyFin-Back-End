import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  registration(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new BadRequestException('Bad request');
    }
    return createUserDto;
  }
}
