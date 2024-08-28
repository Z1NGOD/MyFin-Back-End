import { Test, type TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from '@libs/db/repositories/categories.repository';
import { CategoriesService } from '../services/categories.service';
import { type CategoryDto } from '../dto';

describe('categoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      jest.spyOn(service, 'findAll');

      expect(await service.findAll()).toBe(undefined);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should return a category', async () => {
      const categoryDto: CategoryDto = {
        name: 'Food',
      };

      jest.spyOn(repository, 'create').mockResolvedValue(categoryDto as any);

      expect(await service.create(categoryDto)).toBe(categoryDto);
      expect(repository.create).toHaveBeenCalledWith(categoryDto);
    });
  });
});
