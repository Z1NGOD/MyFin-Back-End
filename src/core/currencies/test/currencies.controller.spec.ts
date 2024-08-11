import { Test, type TestingModule } from '@nestjs/testing';
import { CurrenciesController } from '../controllers/currencies.controller';
import { CurrenciesService } from '../services/currencies.service';

describe('currenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        CurrenciesService,
        { provide: CurrenciesService, useValue: { findAll: jest.fn() } },
      ],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of currencies', async () => {
      const result = [
        {
          _id: 'currency-id',
          name: 'name',
          symbol: 'symbol',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
