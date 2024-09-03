import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '@libs/db';
import { CategoryDto } from '../dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }

  create(categoryDto: CategoryDto) {
    return this.categoriesRepository.create(categoryDto);
  }
}
