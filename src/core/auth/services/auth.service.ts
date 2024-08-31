import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@core/user/dto';
import { TokenService, PasswordService } from '@libs/security';
import { RedisService } from '@libs/redis/services/redis.service';
import { UserService } from '@core/user/services';
import { UserAlreadyExistsException } from '@common/exceptions';
import { LoginUserDto } from '../dto';
import { RequestUser } from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly config: ConfigService,
    private readonly passwordService: PasswordService,
  ) {}

  async registration(userDto: CreateUserDto) {
    if (!userDto) {
      throw new BadRequestException('Bad request');
    }

    if (await this.userService.findByEmail(userDto.email)) {
      throw new UserAlreadyExistsException('User already exists');
    }

    const hashedPassword = await this.passwordService.scryptHash(
      userDto.password,
    );

    const payload = { sub: userDto };
    const tokens = await this.createTokens(payload);
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    return { user, ...tokens };
  }

  async login(userDto: LoginUserDto) {
    if (!userDto) {
      throw new BadRequestException('No user data');
    }

    const user = await this.userService.findByEmail(userDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordCorrect = await this.passwordService.scryptVerify(
      userDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Wrong password');
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
