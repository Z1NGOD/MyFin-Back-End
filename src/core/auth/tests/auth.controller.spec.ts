import { Test, type TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

describe('authController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('call registration', () => {
    const userMock = {
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    jest.spyOn(authService, 'registration');
    controller.registration(userMock);

    expect(authService.registration).toHaveBeenCalled();
    expect(authService.registration).toHaveBeenCalledWith(userMock);
  });
});
