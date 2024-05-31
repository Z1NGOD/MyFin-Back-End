import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import { RedisClient } from '../providers/redis.provider';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: RedisClient,
  ) {}
  onModuleDestroy() {
    this.disconnect();
  }
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

  async setTokenToBlacklist(token: string, expiration: number) {
    return await this.redis.set(token, 'true', 'EX', expiration);
  }
}
