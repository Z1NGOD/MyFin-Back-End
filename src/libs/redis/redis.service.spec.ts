import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { type RedisClient } from './redis.provider';
import { RedisService } from './redis.service';

const redisMockObject = {
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  setToken: jest.fn(),
  getToken: jest.fn(),
  setRefreshToken: jest.fn(),
  getRefreshToken: jest.fn(),
};

describe('redisService', () => {
  let service: RedisService;
  let redisMock: RedisClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: redisMockObject,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisMock = module.get<RedisClient>('REDIS_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should disconnect from Redis', () => {
    service.disconnect();
    expect(redisMock.disconnect).toHaveBeenCalled();
  });

  it('should set a value in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    await service.set(key, value);
    expect(redisMock.set).toHaveBeenCalledWith(key, value);
  });

  it('should get a value from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';
    (redisMock.get as jest.Mock).mockResolvedValue(value);
    const result = await service.get(key);
    expect(redisMock.get).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('should delete a value from Redis', async () => {
    const key = 'testKey';
    await service.del(key);
    expect(redisMock.del).toHaveBeenCalledWith(key);
  });

  it('should set a token in Redis', async () => {
    const value = 'testToken';
    const exparation = 100;
    await service.setToken(value, exparation);
    expect(redisMock.set).toHaveBeenCalledWith(
      'token',
      value,
      'EX',
      exparation,
    );
  });

  it('should get a token from Redis', async () => {
    const value = 'testToken';
    (redisMock.get as jest.Mock).mockResolvedValue(value);
    const result = await service.getToken();
    expect(redisMock.get).toHaveBeenCalled();
    expect(result).toBe(value);
  });

  it('should set a refresh token in Redis', async () => {
    const value = 'testRefreshToken';
    const exparation = 100;
    await service.setRefreshToken(value, exparation);
    expect(redisMock.set).toHaveBeenCalledWith(
      'refreshToken',
      value,
      'EX',
      exparation,
    );
  });

  it('should get a refresh token from Redis', async () => {
    const value = 'testRefreshToken';
    (redisMock.get as jest.Mock).mockResolvedValue(value);
    const result = await service.getRefreshToken();
    expect(redisMock.get).toHaveBeenCalled();
    expect(result).toBe(value);
  });
});
