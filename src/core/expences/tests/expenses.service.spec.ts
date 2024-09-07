import { Test, type TestingModule } from '@nestjs/testing';
import {
  CategoriesRepository,
  CurrenciesRepository,
  ExpenseRepository,
} from '@libs/db';
import { ExpensesService } from '../services/expenses.service';
import type { CreateExpenseDto, UpdateExpenseDto } from '../dto';

describe('expensesService', () => {
  let service: ExpensesService;
  let repository: ExpenseRepository;
  let categoriesRepository: CategoriesRepository;
  let currenciesRepository: CurrenciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: ExpenseRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            calculateAmount: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CategoriesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: CurrenciesRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    repository = module.get<ExpenseRepository>(ExpenseRepository);
    categoriesRepository =
      module.get<CategoriesRepository>(CategoriesRepository);
    currenciesRepository =
      module.get<CurrenciesRepository>(CurrenciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const fixedDate = new Date('2023-01-01T00:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      const createExpenseDto: CreateExpenseDto = {
        userId: 'user-id',
        categoryId: '66cca6e1bcca345eb76427fa',
        currencyId: '66b8c50a36f209530248369d',
        amount: 100,
        date: fixedDate,
        details: 'details',
      };

      jest.spyOn(categoriesRepository, 'findById').mockResolvedValue({
        _id: '66cca6e1bcca345eb76427fa',
        name: 'Food',
      });

      jest.spyOn(currenciesRepository, 'findById').mockResolvedValue({
        _id: '66b8c50a36f209530248369d',
        name: 'USD',
        symbol: '$',
        exchangeRate: 1,
      });

      const result = { ...createExpenseDto, _id: 'expense-id' };
      jest.spyOn(repository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createExpenseDto)).toBe(result);
      expect(repository.create).toHaveBeenCalledWith(createExpenseDto);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of expenses', async () => {
      const result = [
        {
          userId: 'user-id',
          categoryId: 'Food',
          currencyId: '$',
          amount: 100,
          details: 'details',
          date: new Date(),
          _id: 'expense-id',
        },
      ];
      jest.spyOn(repository, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll('/', '10', '1')).toBe(result);
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.findAll).toHaveBeenCalledTimes(1);
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

      expect(await service.findOne('expense/expense-id')).toBe(result);
      expect(repository.findById).toHaveBeenCalledWith('expense/expense-id');
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
  describe('calculateExpensesAmount', () => {
    it('should calculate expenses amount', async () => {
      const result = 1000;
      jest.spyOn(repository, 'calculateAmount').mockResolvedValue(result);

      expect(await service.calculateAmount('/')).toBe(result);
    });
  });
});
