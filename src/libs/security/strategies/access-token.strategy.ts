import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserRepository } from '../../db/repositories/user.repository';
import { RedisService } from '../../redis/services/redis.service';
import { ACCESS_STRATEGY_NAME } from '../../../common/constants';

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
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const isTokenInBlacklist = await this.redis.get(token);

    if (isTokenInBlacklist) {
      throw new UnauthorizedException('Token already in blacklist');
    }

    const user = await this.userRepository.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Please log in to continue');
    }

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
