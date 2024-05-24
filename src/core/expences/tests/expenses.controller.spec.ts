import { Test, type TestingModule } from '@nestjs/testing';
import { ExpensesController } from '../controllers/expenses.controller';
import { ExpensesService } from '../services/expenses.service';
import { type CreateExpenseDto, type UpdateExpenseDto } from '../dto';

describe('expensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of expenses', async () => {
      const result = [
        {
          userId: 'user-id',
          categoryId: 'category-id',
          currencyId: 'currency-id',
          amount: 100,
          details: 'details',
          _id: 'expense-id',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single expense', async () => {
      const result = {
        userId: 'user-id',
        categoryId: 'category-id',
        currencyId: 'currency-id',
        amount: 100,
        details: 'details',
        _id: 'expense-id',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('expense-id')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('expense-id');
    });
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        userId: 'user-id',
        categoryId: 'category-id',
        currencyId: 'currency-id',
        amount: 100,
        details: 'details',
      };

      const result = { ...createExpenseDto, _id: 'expense-id' };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createExpenseDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createExpenseDto);
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        userId: 'new-user-id',
        amount: 200,
      };

      const result = { ...updateExpenseDto, _id: 'expense-id' };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('expense-id', updateExpenseDto)).toBe(
        result,
      );
      expect(service.update).toHaveBeenCalledWith(
        'expense-id',
        updateExpenseDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      const result = {
        _id: 'expense-id',
        userId: 'user-id',
        categoryId: 'category-id',
        currencyId: 'currency-id',
        amount: 100,
        details: 'details',
      };
      jest.spyOn(service, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove('expense-id')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('expense-id');
    });
  });
});
