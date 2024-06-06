import { Test, type TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@libs/redis/services/redis.service';
import { AuthService } from '../services';
import { TokenService } from '../../../libs/security';
import { UserService } from '../../user/services/user.service';
import { type LoginUserDto } from '../dto';
import { type CreateUserDto } from '../../user/dto';
import { type RequestUser } from '../interfaces';

describe('authService', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let userService: UserService;
  let redisService: RedisService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: TokenService,
          useValue: {
            createAccessToken: jest.fn(),
            createRefreshToken: jest.fn(),
            verifyAccessToken: jest.fn(),
            verifyRefreshToken: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            setTokenToBlacklist: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'ACCESS_EXPIRE_TIME') return '3600';
              if (key === 'REFRESH_EXPIRE_TIME') return '7200';
              if (key === 'ACCESS_SECRET') return 'access_secret';
              if (key === 'REFRESH_SECRET') return 'refresh_secret';
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
    userService = module.get<UserService>(UserService);
    redisService = module.get<RedisService>(RedisService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('registration', () => {
    it('should throw BadRequestException if no userDto', async () => {
      await expect(authService.registration(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue({} as any);

      const userDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await expect(authService.registration(userDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user and tokens on successful registration', async () => {
      const userDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(userService, 'create')
        .mockResolvedValue({ _id: 'user_id', ...userDto } as any);
      jest
        .spyOn(tokenService, 'createAccessToken')
        .mockResolvedValue('access_token');
      jest
        .spyOn(tokenService, 'createRefreshToken')
        .mockResolvedValue('refresh_token');

      const result = await authService.registration(userDto);

      expect(result).toEqual({
        user: { _id: 'user_id', ...userDto },
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });

  describe('login', () => {
    it('should throw BadRequestException if no userDto', async () => {
      await expect(authService.login(null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const userDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      await expect(authService.login(userDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user and tokens on successful login', async () => {
      const user = {
        _id: 'user_id',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user as any);
      jest
        .spyOn(tokenService, 'createAccessToken')
        .mockResolvedValue('access_token');
      jest
        .spyOn(tokenService, 'createRefreshToken')
        .mockResolvedValue('refresh_token');

      const userDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };

      const result = await authService.login(userDto);

      expect(result).toEqual({
        user,
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });

  describe('logout', () => {
    it('should add tokens to blacklist', () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ACCESS_EXPIRE_TIME') return 3600;
        if (key === 'REFRESH_EXPIRE_TIME') return 7200;
      });

      const refreshToken = 'refresh_token';
      const accessToken = 'access_token';

      const result = authService.logout(refreshToken, accessToken);

      expect(result).toBe(true);
      expect(redisService.setTokenToBlacklist).toHaveBeenCalledWith(
        accessToken,
        3.6,
      );
      expect(redisService.setTokenToBlacklist).toHaveBeenCalledWith(
        refreshToken,
        7.2,
      );
    });
  });

  describe('updateAccessToken', () => {
    it('should throw BadRequestException if no refreshToken', async () => {
      await expect(
        authService.updateAccessToken(null, {
          id: 'user_id',
          email: 'john.doe@example.com',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should return new access token', async () => {
      jest
        .spyOn(tokenService, 'createAccessToken')
        .mockResolvedValue('new_access_token');

      const refreshToken = 'refresh_token';
      const user: RequestUser = {
        id: 'user_id',
        email: 'john.doe@example.com',
      };

      const result = await authService.updateAccessToken(refreshToken, user);

      expect(result).toEqual({ accessToken: 'new_access_token' });
    });
  });
});
