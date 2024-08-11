import { Test, type TestingModule } from '@nestjs/testing';
import { CurrenciesRepository } from '@libs/db/repositories/currencies.repository';
import { CurrenciesService } from '../services/currencies.service';

describe('currenciesService', () => {
  let service: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrenciesRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      expect(await service.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
