import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './services';
import { AccessTokenStrategy } from './strategies';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PasswordService } from './services/password.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRE_TIME') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    PasswordService,
  ],
  exports: [TokenService, PasswordService],
})
export class SecurityModule {}
