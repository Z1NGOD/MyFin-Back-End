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
  async setToken(value: string, exparation: number, userEmail: string) {
    return await this.redis.set(
      `tokenFor${userEmail}`,
      value,
      'EX',
      exparation,
    );
  }
  async getToken(userEmail: string) {
    return await this.redis.get(`tokenFor${userEmail}`);
  }
  async setRefreshToken(value: string, exparation: number, userEmail: string) {
    return await this.redis.set(
      `refreshTokenFor${userEmail}`,
      value,
      'EX',
      exparation,
    );
  }
  async getRefreshToken(userEmail: string) {
    return await this.redis.get(`refreshTokenFor${userEmail}`);
  }
}
