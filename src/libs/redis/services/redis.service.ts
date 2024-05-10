import { Injectable, Inject } from '@nestjs/common';
import { RedisClient } from '../providers/redis.provider';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClient,
  ) {}

  disconnect() {
    this.redis.disconnect();
  }
  async set(key: string, value: string) {
    return await this.redis.set(key, value);
  }
  async get(key: string) {
    return await this.redis.get(key);
  }
  async del(key: string) {
    return await this.redis.del(key);
  }

  async setTokenToBlacklist(token: string, exparation: number) {
    return await this.redis.set(token, 'true', 'EX', exparation);
  }
}
