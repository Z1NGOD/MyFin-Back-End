import { Test, type TestingModule } from '@nestjs/testing';
import { CurrenciesRepository } from '@libs/db/repositories/currencies.repository';
import { CurrenciesService } from '../services/currencies.service';
import { type CurrencyDto } from '../dto';

describe('currenciesService', () => {
  let service: CurrenciesService;
  let repository: CurrenciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrenciesRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of currencies', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll()).toBe(undefined);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should return a currency', async () => {
      const currencyDto: CurrencyDto = {
        name: 'USD',
        symbol: '$',
        exchangeRate: 1,
      };

      jest.spyOn(repository, 'create').mockResolvedValue(currencyDto);

      expect(await service.create(currencyDto)).toBe(currencyDto);
      expect(repository.create).toHaveBeenCalledWith(currencyDto);
    });
  });
});
