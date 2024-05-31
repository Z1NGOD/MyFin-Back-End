import { Test, type TestingModule } from '@nestjs/testing';
import { BudgetsRepository } from '../../../libs/db/repositories';
import { BudgetsService } from '../services/budgets.service';
import { type CreateBudgetDto, type UpdateBudgetDto } from '../dto';
import { BudgetType } from '../enum/budget.enum';

describe('budgetsService', () => {
  let service: BudgetsService;
  let repository: BudgetsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetsService,
        {
          provide: BudgetsRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BudgetsService>(BudgetsService);
    repository = module.get<BudgetsRepository>(BudgetsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('shoud create a budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        userId: 'user-id',
        currencyId: 'currency-id',
        amount: 100,
        type: BudgetType.WEEK,
      };

      const result = { ...createBudgetDto, _id: 'budget-id' };
      jest.spyOn(repository, 'create').mockResolvedValue(result as any);

      expect(await service.create(createBudgetDto)).toBe(result);
      expect(repository.create).toHaveBeenCalledWith(createBudgetDto);
    });
  });

  describe('findById', () => {
    it('should return a single budget', async () => {
      const result = {
        _id: 'budget-id',
        userId: 'user-id',
        currencyId: 'currency-id',
        amount: 100,
        type: BudgetType.WEEK,
      };
      jest.spyOn(repository, 'findById').mockResolvedValue(result as any);

      expect(await service.findOne('budget-id')).toBe(result);
      expect(repository.findById).toHaveBeenCalledWith('budget-id');
    });
  });

  describe('update', () => {
    it('should update an budget', async () => {
      const updateBudgetDto: UpdateBudgetDto = {
        userId: 'new-user-id',
        currencyId: 'new-currency-id',
        amount: 200,
        type: BudgetType.MONTH,
      };

      const result = { ...updateBudgetDto, _id: 'budget-id' };
      jest.spyOn(repository, 'update').mockResolvedValue(result as any);

      expect(await service.update('budget-id', updateBudgetDto)).toBe(result);
      expect(repository.update).toHaveBeenCalledWith(
        'budget-id',
        updateBudgetDto,
      );
    });
  });
});
