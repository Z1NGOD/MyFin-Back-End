import { Test, type TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthController } from '../controllers';
import { AuthService } from '../services/auth.service';
import { type LoginUserDto } from '../dto';
import { type CreateUserDto } from '../../user/dto';
import { type RequestUser } from '../interfaces';
import { type TokensDto } from '../dto/tokens.dto';

describe('authController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registration: jest.fn(),
            login: jest.fn(),
            updateAccessToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('registration', () => {
    it('should register a user and return the user with tokens', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const result = {
        user: createUserDto,
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      jest.spyOn(authService, 'registration').mockResolvedValue(result);

      expect(await authController.registration(createUserDto)).toBe(result);
      expect(authService.registration).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException when userDto is invalid', async () => {
      const createUserDto = null;

      jest
        .spyOn(authService, 'registration')
        .mockRejectedValue(new BadRequestException('Bad request'));
      await expect(authController.registration(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest
        .spyOn(authService, 'registration')
        .mockRejectedValue(new UnauthorizedException('User already exists'));
      await expect(authController.registration(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should login a user and return the user with tokens', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const result = {
        user: loginUserDto,
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(result);

      expect(await authController.login(loginUserDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it('should throw BadRequestException when userDto is invalid', async () => {
      const loginUserDto = null;

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new BadRequestException('userDto is invalid'));
      await expect(authController.login(loginUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('user no found'));
      await expect(authController.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('updateAccessToken', () => {
    it('should update the access token', async () => {
      const refreshToken = 'refresh_token';
      const user: RequestUser = {
        id: 'user_id',
        email: 'john.doe@example.com',
      };
      const result = { accessToken: 'new_access_token' };

      jest.spyOn(authService, 'updateAccessToken').mockResolvedValue(result);

      const req = { user };
      expect(await authController.updateAccessToken(req, refreshToken)).toBe(
        result,
      );
      expect(authService.updateAccessToken).toHaveBeenCalledWith(
        refreshToken,
        user,
      );
    });

    it('should throw BadRequestException when refreshToken is invalid', async () => {
      const refreshToken = '';
      const user: RequestUser = {
        id: 'user_id',
        email: 'john.doe@example.com',
      };

      jest
        .spyOn(authService, 'updateAccessToken')
        .mockRejectedValue(new BadRequestException('no refreshToken'));
      const req = { user };
      await expect(
        authController.updateAccessToken(req, refreshToken),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException when user is unauthorized', async () => {
      const refreshToken = 'invalid_token';
      const user: RequestUser = {
        id: 'user_id',
        email: 'john.doe@example.com',
      };

      jest
        .spyOn(authService, 'updateAccessToken')
        .mockRejectedValue(new ForbiddenException('user is unauthorized'));
      const req = { user };
      await expect(
        authController.updateAccessToken(req, refreshToken),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should logout the user', () => {
      const tokens: TokensDto = {
        refreshToken: 'refresh_token',
        accessToken: 'access_token',
      };

      jest.spyOn(authService, 'logout').mockReturnValue(true);

      authController.logout(tokens);

      expect(authService.logout).toHaveBeenCalledWith(
        tokens.refreshToken,
        tokens.accessToken,
      );
    });
  });
});
