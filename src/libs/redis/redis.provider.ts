import { Redis } from 'ioredis';
import type { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (config: ConfigService): RedisClient => {
    return new Redis({
      host: config.get<string>('redis.host'),
      port: config.get<number>('redis.port'),
      username: config.get<string>('redis.username'),
      password: config.get<string>('redis.password'),
      db: 0,
    });
  },
  inject: [ConfigService],
  provide: 'REDIS_CLIENT',
};
