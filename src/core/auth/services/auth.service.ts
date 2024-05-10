import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services';
import { TokenService } from '../../../libs/security/services';
import { LoginUserDto, CreateUserDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
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

  async validateRefreshToken(refreshToken: string, userDto: LoginUserDto) {
    if (!refreshToken) {
      throw new BadRequestException('No refresh token');
    }
    const payload = { sub: userDto };
    const accessToken = await this.tokenService.createAccessToken(payload);

    return { accessToken };
  }

  private async createTokens<T>(payload: { sub: T; email?: string }) {
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
