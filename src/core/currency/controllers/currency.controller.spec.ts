import { Test, type TestingModule } from '@nestjs/testing';
import { CurrencyService } from '../services/currency.service';
import { CurrencyController } from './currency.controller';

describe('currencyController', () => {
  let controller: CurrencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyController],
      providers: [CurrencyService],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
