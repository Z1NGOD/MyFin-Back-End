import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CategoryDto } from '../dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post('create')
  create(@Body() categoryDto: CategoryDto) {
    return this.categoriesService.create(categoryDto);
  }
}
