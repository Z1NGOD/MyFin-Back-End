import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../../../libs/security/services';
import { RedisService } from '../../../libs/redis/services/redis.service';
import { UserService } from '../../user/services';
import { LoginUserDto, CreateUserDto } from '../dto';
import { RequestUser } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly config: ConfigService,
  ) {}

  async registration(userDto: CreateUserDto) {
    if (!userDto) {
      throw new BadRequestException('Bad request');
    }

    if (await this.userService.findByEmail(userDto.email)) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userService.create(userDto);
    const payload = { sub: userDto };
    const tokens = await this.createTokens(payload);

    return { user, ...tokens };
  }

  async login(userDto: LoginUserDto) {
    if (!userDto) {
      throw new BadRequestException('No user data');
    }

    const user = await this.userService.findByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { sub: user._id, email: user.email };
    const tokens = await this.createTokens(payload);

    return { user, ...tokens };
  }

  logout(refreshToken: string, accessToken: string) {
    this.redisService.setTokenToBlacklist(
      accessToken,
      this.config.get<number>('ACCESS_EXPIRE_TIME') / 1000,
    );
    this.redisService.setTokenToBlacklist(
      refreshToken,
      this.config.get<number>('REFRESH_EXPIRE_TIME') / 1000,
    );

    return true;
  }

  async updateAccessToken(refreshToken: string, user: RequestUser) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token');
    }
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.tokenService.createAccessToken(payload);

    return { accessToken };
  }

  private async createTokens<T>(payload: { sub: T; email?: string }) {
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
