import { Module } from '@nestjs/common';
import { SecurityModule } from '@libs/security/security.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [SecurityModule],
})
export class AuthModule {}
