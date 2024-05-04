import { Module } from '@nestjs/common';
import { RedisService } from './services/redis.service';
import { redisProvider } from './providers/redis.provider';

@Module({
  providers: [redisProvider, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
