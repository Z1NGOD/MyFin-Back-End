import { Test, type TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';

describe('userService', () => {
  let service: UserService;
  const _id = '662a8b0dd52cd2e44087a698';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dto', () => {
    const userMock = {
      _id: '662a8b0dd52cd2e44087a698',
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    expect(service.update(_id, userMock)).toBe(userMock);
  });

  it('should throw an error', () => {
    expect(() => service.update(null, null)).toThrow(
      new BadRequestException('Bad request'),
    );
  });
});
