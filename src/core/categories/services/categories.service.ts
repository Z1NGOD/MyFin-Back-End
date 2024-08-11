import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '@libs/db/repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesrepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesrepository.findAll();
  }
}
