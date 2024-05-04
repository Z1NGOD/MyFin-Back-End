import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from '../providers/redis.provider';

@Injectable()
export class RedisService {
  constructor(
    private readonly cofnigService: ConfigService,
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
  async setToken(value: string, exparation: number) {
    return await this.redis.set('token', value, 'EX', exparation);
  }
  async getToken() {
    return await this.redis.get('token');
  }
  async setRefreshToken(value: string, exparation: number) {
    return await this.redis.set('refreshToken', value, 'EX', exparation);
  }
  async getRefreshToken() {
    return await this.redis.get('refreshToken');
  }
}
