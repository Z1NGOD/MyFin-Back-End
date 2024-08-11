import { Module } from '@nestjs/common';
import { DbModule } from '@libs/db/db.module';
import { CategoriesRepository } from '@libs/db/repositories/categories.repository';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';

@Module({
  imports: [DbModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
