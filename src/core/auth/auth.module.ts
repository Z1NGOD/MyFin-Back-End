import { Module } from '@nestjs/common';
import { JwtStrategy } from '@libs/security/strategies/jwt.strategy';
import { JwtAuthGuard } from '@libs/security/guards/jwt-auth.guard';
import { SecurityModule } from '@libs/security/security.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  imports: [SecurityModule],
})
export class AuthModule {}
