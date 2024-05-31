import { Module } from '@nestjs/common';
import { DbModule } from '../../libs/db/db.module';
import { SecurityModule } from '../../libs/security/security.module';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DbModule, SecurityModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
