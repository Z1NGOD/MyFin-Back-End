import { Test, type TestingModule } from '@nestjs/testing';
import { ExpensesService } from '../services/expenses.service';
import { ExpensesController } from './expenses.controller';

describe('expencesController', () => {
  let controller: ExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [ExpensesService],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
