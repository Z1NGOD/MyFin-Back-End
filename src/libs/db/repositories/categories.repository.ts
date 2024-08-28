import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoriesDocument } from '../models';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<Category>,
  ) {}

  async findAll(): Promise<CategoriesDocument[]> {
    return await this.CategoryModel.find();
  }

  async findById(id: string): Promise<CategoriesDocument> {
    return await this.CategoryModel.findById(id);
  }
}
