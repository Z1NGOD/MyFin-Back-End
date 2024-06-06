import { Test, type TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@libs/db/repositories';
import { RedisService } from '@libs/redis/services/redis.service';
import { REFRESH_STRATEGY_NAME } from '@common/constants';
import { type JwtPayload } from '../strategies';
import { RefreshTokenStrategy } from '../strategies/refresh-token.strategy';

describe('refreshTokenAuthGuard', () => {
  let strategy: RefreshTokenStrategy;
  let userRepository: UserRepository;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenStrategy,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-refresh-secret') },
        },
        {
          provide: UserRepository,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: RedisService,
          useValue: { get: jest.fn() },
        },
        {
          provide: REFRESH_STRATEGY_NAME,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    strategy = module.get<RefreshTokenStrategy>(RefreshTokenStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('refreshTokenStrategy', () => {
    it('should validate and return a user object if the token is not blacklisted and user exists', async () => {
      const req = { body: { refreshToken: 'test-refresh-token' } };
      const payload: JwtPayload = { sub: '1', email: 'test@example.com' };
      const user = { id: '1', email: 'test@example.com' };

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await strategy.validate(req, payload);

      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should throw UnauthorizedException if the token is blacklisted', async () => {
      const req = { body: { refreshToken: 'test-refresh-token' } };
      const payload: JwtPayload = { sub: '1', email: 'test@example.com' };

      jest.spyOn(redisService, 'get').mockResolvedValue('blacklisted');

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        new UnauthorizedException('Token already in blacklist'),
      );
    });

    it('should throw UnauthorizedException if the user does not exist', async () => {
      const req = { body: { refreshToken: 'test-refresh-token' } };
      const payload: JwtPayload = { sub: '1', email: 'test@example.com' };

      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        new UnauthorizedException('Please log in to continue'),
      );
    });
  });
});
