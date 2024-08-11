import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as schemas from '../models';
import { CategoriesDocument } from '../models/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(schemas.Category.Category.name)
    private readonly CategoryModel: Model<schemas.Category.Category>,
  ) {}

  async findAll(): Promise<CategoriesDocument[]> {
    return await this.CategoryModel.find();
  }
}
