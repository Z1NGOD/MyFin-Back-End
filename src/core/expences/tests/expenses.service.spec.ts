import { Test, type TestingModule } from '@nestjs/testing';
import { ExpenseRepository } from '../../../libs/db/repositories/expences.repository';
import { ExpensesService } from '../services/expenses.service';
import { type CreateExpenseDto } from '../dto/create-expense.dto';
import { type UpdateExpenseDto } from '../dto/update-expense.dto';

describe('expensesService', () => {
  let service: ExpensesService;
  let repository: ExpenseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: ExpenseRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<ExpenseRepository>(ExpenseRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      jest.spyOn(repository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createExpenseDto)).toBe(result);
      expect(repository.create).toHaveBeenCalledWith(createExpenseDto);
    });
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
      jest.spyOn(repository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll()).toBe(result);
      expect(repository.findAll).toHaveBeenCalled();
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
      jest.spyOn(repository, 'findById').mockResolvedValue(result as any);

      expect(await service.findOne('expense-id')).toBe(result);
      expect(repository.findById).toHaveBeenCalledWith('expense-id');
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        userId: 'new-user-id',
        amount: 200,
      };

      const result = { ...updateExpenseDto, _id: 'expense-id' };
      jest.spyOn(repository, 'update').mockResolvedValue(result as any);

      expect(await service.update('expense-id', updateExpenseDto)).toBe(result);
      expect(repository.update).toHaveBeenCalledWith(
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
      jest.spyOn(repository, 'delete').mockResolvedValue(result as any);

      expect(await service.remove('expense-id')).toBe(result);
      expect(repository.delete).toHaveBeenCalledWith('expense-id');
    });
  });
});
