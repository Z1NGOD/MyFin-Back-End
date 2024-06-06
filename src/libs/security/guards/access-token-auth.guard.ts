import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACCESS_STRATEGY_NAME } from '@common/constants';

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_STRATEGY_NAME) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Documentation example
    return user;
  }
}
