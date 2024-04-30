import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from '@libs/db/configs/redis.config';
import { DbModule } from './libs/db/db.module';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './libs/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
    DbModule,
    AuthModule,
    RedisModule,
  ],
})
export class AppModule {}
