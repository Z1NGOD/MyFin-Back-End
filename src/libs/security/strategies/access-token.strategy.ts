import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_STRATEGY_NAME } from '../../../common/constants';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  validate(payload: { sub: object }) {
    return { ...payload.sub };
  }
}
