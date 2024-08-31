import { Module } from '@nestjs/common';
import { SecurityModule } from '@libs/security';
import { RedisModule } from '@libs/redis/redis.module';
import { UserModule } from '@core/user';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [SecurityModule, RedisModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
