import { Test, type TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../services/token.servise';

describe('tokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('createAccessToken', () => {
    it('should create an access token', async () => {
      const payload = { sub: '123' };
      const accessToken = 'access_token';
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'ACCESS_EXPIRE_TIME') return '1h';
        if (key === 'ACCESS_SECRET') return 'access_secret';
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);

      const result = await tokenService.createAccessToken(payload);

      expect(result).toBe(accessToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: '1h',
        secret: 'access_secret',
      });
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token', async () => {
      const payload = { sub: '123' };
      const refreshToken = 'refresh_token';
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'REFRESH_EXPIRE_TIME') return '7d';
        if (key === 'REFRESH_SECRET') return 'refresh_secret';
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(refreshToken);

      const result = await tokenService.createRefreshToken(payload);

      expect(result).toBe(refreshToken);
      expect(jwtService.signAsync).toHaveBeenCalledWith(payload, {
        expiresIn: '7d',
        secret: 'refresh_secret',
      });
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify an access token', () => {
      const token = 'access_token';
      const decodedToken = { sub: '123' };
      jest.spyOn(configService, 'get').mockReturnValue('access_secret');
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = tokenService.verifyAccessToken(token);

      expect(result).toBe(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'access_secret',
      });
    });

    it('should throw an error for an invalid access token', () => {
      const token = 'invalid_access_token';
      jest.spyOn(configService, 'get').mockReturnValue('access_secret');
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => tokenService.verifyAccessToken(token)).toThrow(
        'Invalid token',
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a refresh token', () => {
      const token = 'refresh_token';
      const decodedToken = { sub: '123' };
      jest.spyOn(configService, 'get').mockReturnValue('refresh_secret');
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);

      const result = tokenService.verifyRefreshToken(token);

      expect(result).toBe(decodedToken);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: 'refresh_secret',
      });
    });

    it('should throw an error for an invalid refresh token', () => {
      const token = 'invalid_refresh_token';
      jest.spyOn(configService, 'get').mockReturnValue('refresh_secret');
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => tokenService.verifyRefreshToken(token)).toThrow(
        'Invalid token',
      );
    });
  });
});
