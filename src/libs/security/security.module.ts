import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DbModule } from '../db/db.module';
import { TokenService } from './services';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PasswordService } from './services/password.service';

@Module({
  imports: [JwtModule.register({}), DbModule],
  providers: [
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PasswordService,
  ],
  exports: [TokenService, PasswordService],
})
export class SecurityModule {}
