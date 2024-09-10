import { Test, type TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { type UpdateUserDto } from '../dto';

describe('userController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update the User', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'string',
        lastName: 'string',
        email: 'string@gmail.com',
        password: 'NeWPass06d',
      };
      const result = { ...updateDto, _id: 'user_id' };

      jest.spyOn(userService, 'update').mockResolvedValue(result as any);

      expect(await controller.update('user_id', updateDto)).toBe(result);
      expect(userService.update).toHaveBeenCalledWith('user_id', updateDto);
    });

    it('should handle errors when updating a user', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'string',
        lastName: 'string',
        email: 'string@gmail.com',
        password: 'NeWPass06d',
      };

      jest
        .spyOn(userService, 'update')
        .mockRejectedValue(
          new HttpException('Some property is wrong', HttpStatus.BAD_REQUEST),
        );

      await expect(controller.update('user_id', updateDto)).rejects.toThrow(
        HttpException,
      );
      expect(userService.update).toHaveBeenCalledWith('user_id', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = {
        _id: 'user-id',
        firstName: 'string',
        lastName: 'string',
        email: 'string@gmail.com',
        password: 'NeWPass06d',
      };
      jest.spyOn(userService, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove('user-id')).toBe(result);
      expect(userService.remove).toHaveBeenCalledWith('user-id');
    });

    it('should handle errors when removing a user', async () => {
      jest
        .spyOn(userService, 'remove')
        .mockRejectedValue(
          new HttpException(
            'Can not delete this user by id!',
            HttpStatus.BAD_REQUEST,
          ),
        );

      await expect(controller.remove('user-id')).rejects.toThrow(HttpException);
      expect(userService.remove).toHaveBeenCalledWith('user-id');
    });
  });
});
