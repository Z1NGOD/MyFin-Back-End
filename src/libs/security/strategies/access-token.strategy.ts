import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ACCESS_STRATEGY_NAME } from '@common/constants';
import { UserRepository } from '@libs/db/repositories/user.repository';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_STRATEGY_NAME,
) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_SECRET'),
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findOne(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
