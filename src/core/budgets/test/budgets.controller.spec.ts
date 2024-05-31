import { Test, type TestingModule } from '@nestjs/testing';
import { BudgetsController } from '../controllers/budgets.controller';
import { BudgetsService } from '../services/budgets.service';

describe('budgetsController', () => {
  let controller: BudgetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [BudgetsService],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
