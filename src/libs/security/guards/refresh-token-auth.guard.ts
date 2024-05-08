import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_STRATEGY_NAME } from '@common/constants';

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(REFRESH_STRATEGY_NAME) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new ForbiddenException();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Documentation example
    return user;
  }
}
