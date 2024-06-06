import { Test, type TestingModule } from '@nestjs/testing';
import { BudgetsController } from '../controllers/budgets.controller';
import { BudgetsService } from '../services/budgets.service';
import { type UpdateBudgetDto, type CreateBudgetDto } from '../dto';
import { BudgetType } from '../enum/budget.enum';

describe('budgetsController', () => {
  let controller: BudgetsController;
  let service: BudgetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [
        {
          provide: BudgetsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);
    service = module.get<BudgetsService>(BudgetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('shoud create a budget', async () => {
      const createBudgetDto: CreateBudgetDto = {
        userId: 'user-id',
        currencyId: 'currency-id',
        amount: 100,
        type: BudgetType.Week,
      };

      const result = { ...createBudgetDto, _id: 'budget-id' };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createBudgetDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createBudgetDto);
    });
  });

  describe('findOne', () => {
    it('should return a single budget', async () => {
      const result = {
        _id: 'budget-id',
        userId: 'user-id',
        currencyId: 'currency-id',
        amount: 100,
        type: BudgetType.Week,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne('budget-id')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('budget-id');
    });
  });

  describe('update', () => {
    it('should update an budget', async () => {
      const updateBudgetDto: UpdateBudgetDto = {
        userId: 'new-user-id',
        currencyId: 'new-currency-id',
        amount: 200,
        type: BudgetType.Month,
      };

      const result = { ...updateBudgetDto, _id: 'budget-id' };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('budget-id', updateBudgetDto)).toBe(
        result,
      );
      expect(service.update).toHaveBeenCalledWith('budget-id', updateBudgetDto);
    });
  });
});
