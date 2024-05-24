import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../models/category.schema';
import { categoryDataJson } from '../seeds/category.seed.data';

@Injectable()
export class CategoryMigration implements OnModuleInit {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async onModuleInit() {
    await this.checkAndPopulateCollections();
  }

  private async checkAndPopulateCollections() {
    const count = await this.categoryModel.countDocuments();
    if (count === 0) {
      const data = categoryDataJson;
      await this.categoryModel.insertMany(data);
    }
  }
}
