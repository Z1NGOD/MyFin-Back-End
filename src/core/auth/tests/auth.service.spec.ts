import { Test, type TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

describe('authService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return createUserDto', () => {
    const userMock = {
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    expect(service.registration(userMock)).toBe(userMock);
  });

  it('should throw an error on empty registration data', () => {
    const emptyUser = undefined;
    expect(() => service.registration(emptyUser)).toThrow(
      new BadRequestException('Bad request'),
    );
  });

  it('should return checkUserDto', () => {
    const userMock = {
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    expect(service.login(userMock)).toBe(userMock);
  });

  it('should throw an error on empty login data', () => {
    const emptyUser = undefined;
    expect(() => service.login(emptyUser)).toThrow(
      new BadRequestException('Bad request'),
    );
  });
});
