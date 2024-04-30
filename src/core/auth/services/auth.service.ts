import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenService } from '@libs/security';
import { LoginUserDto, CreateUserDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  async registration(userDto: CreateUserDto) {
    if (!userDto) {
      throw new BadRequestException('Bad request');
    }
    const payload = { sub: userDto };
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    return { ...userDto, accessToken, refreshToken };
  }

  async login(userDto: LoginUserDto) {
    if (!userDto) {
      throw new BadRequestException('Bad request');
    }
    const payload = { sub: userDto };
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    return { ...userDto, accessToken, refreshToken };
  }

  async validateRefreshToken(userDto: LoginUserDto) {
    const payload = { sub: userDto };
    const accessToken = await this.tokenService.createAccessToken(payload);

    return { accessToken };
  }
}
