import { Test, type TestingModule } from '@nestjs/testing';
import { CurrenciesController } from '../controllers/currencies.controller';
import { CurrenciesService } from '../services/currencies.service';

describe('currenciesController', () => {
  let controller: CurrenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [CurrenciesService],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
