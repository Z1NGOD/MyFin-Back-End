import { Test, type TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

describe('userController', () => {
  let controller: UserController;
  let userService: UserService;
  const _id = '662a8b0dd52cd2e44087a698';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('call findAll', () => {
    jest.spyOn(userService, 'findAll');
    controller.findAll();

    expect(userService.findAll).toHaveBeenCalled();
    expect(userService.findAll).toHaveBeenCalledWith();
  });

  it('call findOne', () => {
    jest.spyOn(userService, 'findOne');
    controller.findOne(_id);

    expect(userService.findOne).toHaveBeenCalled();
    expect(userService.findOne).toHaveBeenCalledWith();
  });

  it('call update', () => {
    const userMock = {
      _id: '662a8b0dd52cd2e44087a698',
      firstName: 'string',
      lastName: 'string',
      email: 'string@gmail.com',
      password: 'Q*123qw231eqw23e132qwe',
    };

    jest.spyOn(userService, 'update');
    controller.update(_id, userMock);

    expect(userService.update).toHaveBeenCalled();
    expect(userService.update).toHaveBeenCalledWith();
  });

  it('call remove', () => {
    jest.spyOn(userService, 'remove');
    controller.remove(_id);

    expect(userService.findAll).toHaveBeenCalled();
    expect(userService.findAll).toHaveBeenCalledWith();
  });
});
