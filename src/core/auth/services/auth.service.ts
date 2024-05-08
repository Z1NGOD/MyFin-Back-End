import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services';
import { TokenService } from '../../../libs/security/services';
import { RedisService } from '../../../libs/redis/services/redis.service';
import { LoginUserDto, CreateUserDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  async registration(userDto: CreateUserDto) {
    if (!userDto) {
      throw new BadRequestException('Bad request');
    }

    if (await this.userService.findByEmail(userDto.email)) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.userService.create(userDto);

    //TODO: Think of a way to include a login func here
    // this code is repetable and the login already do this

    const payload = { sub: userDto };

    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    await this.redisService.setToken(accessToken, 60, user.email.toString());
    await this.redisService.setRefreshToken(
      refreshToken,
      60 * 60 * 24 * 3,
      user.email,
    );

    return { user, accessToken, refreshToken };
  }

  async login(userDto: LoginUserDto) {
    if (!userDto) {
      throw new BadRequestException('No user data');
    }
    const payload = { sub: userDto };

    const user = await this.userService.findOne(userDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const getRefreshToken = await this.redisService.getRefreshToken(
      user.email.toString(),
    );

    if (!getRefreshToken) {
      const accessToken = await this.tokenService.createAccessToken(payload);
      const refreshToken = await this.tokenService.createRefreshToken(payload);

      return { accessToken, refreshToken };
    }

    const isValid = this.tokenService.verify(getRefreshToken);
    if (!isValid) {
      throw new BadRequestException('This refresh token is invalid');
    }
    const accessToken = await this.tokenService.createAccessToken(payload);

    return { ...user, accessToken };
  }

  validateRefreshToken(refreshToken: string, userDto: LoginUserDto) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token');
    }
    const isValid = this.tokenService.verify(refreshToken);
    if (!isValid) {
      throw new BadRequestException('This refresh token is invalid');
    }
    const payload = { sub: userDto };
    const accessToken = this.tokenService.createAccessToken(payload);

    return { accessToken };
  }
}
