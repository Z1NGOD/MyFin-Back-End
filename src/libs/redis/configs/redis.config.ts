import { registerAs } from '@nestjs/config';
import { constants } from '../constants/redis.constants';

export const redisConfig = registerAs('redis', () => ({
  host: process.env.REDIS_HOST || constants.defaultHost,
  port: process.env.REDIS_PORT || constants.defaultPort,
  username: process.env.REDIS_USERNAME || constants.defaultUsername,
  password: process.env.REDIS_PASSWORD || constants.defaultPassword,
}));
