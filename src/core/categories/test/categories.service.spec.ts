import { Test, type TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from '@libs/db/repositories/categories.repository';
import { CategoriesService } from '../services/categories.service';

describe('categoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [
        {
          _id: 'category-id',
          name: 'category-name',
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await service.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
