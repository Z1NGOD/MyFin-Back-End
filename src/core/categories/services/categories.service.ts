import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '@libs/db';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }
}
