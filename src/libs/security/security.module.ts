import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret:
        '1d82cbbdec9ad9069f0e18b293bee4f1bbaf8749b587f495022ccfbe8175824f',
      signOptions: { expiresIn: 60 },
    }),
  ],
  providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [TokenService],
})
export class SecurityModule {}
