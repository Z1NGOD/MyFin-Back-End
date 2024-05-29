import { Test, type TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../../libs/db/repositories/user.repository';
import { UserService } from '../services/user.service';
import { type UpdateUserDto, type CreateUserDto } from '../dto';

describe('userService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByEmail: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
      const result = { ...createUserDto, _id: 'user_id' };

      jest.spyOn(repository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createUserDto)).toBe(result);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw an error if creation fails', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      jest
        .spyOn(repository, 'create')
        .mockRejectedValue(new Error('Error creating user'));

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Error creating user',
      );
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const result = [
        {
          _id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        {
          _id: 'user2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
        },
      ];
      jest.spyOn(repository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll()).toBe(result);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });
  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const result = {
        _id: 'user_id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      jest.spyOn(repository, 'findByEmail').mockResolvedValue(result as any);

      expect(await service.findByEmail('john.doe@example.com')).toBe(result);
      expect(repository.findByEmail).toHaveBeenCalledWith(
        'john.doe@example.com',
      );
    });

    it('should return null if user not found', async () => {
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

      expect(
        await service.findByEmail('non_existent_email@example.com'),
      ).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith(
        'non_existent_email@example.com',
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const result = {
        _id: 'user_id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(result as any);

      expect(await service.findOne('user_id')).toBe(result);
      expect(repository.findOne).toHaveBeenCalledWith('user_id');
    });

    it('should return null if user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.findOne('non_existent_id')).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith('non_existent_id');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@example.com',
        password: 'newpassword123',
      };
      const result = { ...updateUserDto, _id: 'user_id' };

      jest.spyOn(repository, 'update').mockResolvedValue(result as any);

      expect(await service.update('user_id', updateUserDto)).toBe(result);
      expect(repository.update).toHaveBeenCalledWith('user_id', updateUserDto);
    });

    it('should throw an error if update fails', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Johnny',
        lastName: 'Doe',
        email: 'johnny.doe@example.com',
        password: 'newpassword123',
      };

      jest
        .spyOn(repository, 'update')
        .mockRejectedValue(new Error('Error updating user'));

      await expect(service.update('user_id', updateUserDto)).rejects.toThrow(
        'Error updating user',
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = { acknowledged: true, deletedCount: 1 };

      jest.spyOn(repository, 'remove').mockResolvedValue(result as any);

      expect(await service.remove('user_id')).toBe(result);
      expect(repository.remove).toHaveBeenCalledWith('user_id');
    });

    it('should throw an error if removal fails', async () => {
      jest
        .spyOn(repository, 'remove')
        .mockRejectedValue(new Error('Error removing user'));

      await expect(service.remove('user_id')).rejects.toThrow(
        'Error removing user',
      );
    });
  });
});
