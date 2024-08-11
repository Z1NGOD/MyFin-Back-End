import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as schemas from '../models';
import { CurrenciesDocument } from '../models/currency.schema';

@Injectable()
export class CurrenciesRepository {
  constructor(
    @InjectModel(schemas.Currency.Currency.name)
    private readonly CurrenciesModel: Model<schemas.Category.Category>,
  ) {}

  async findAll(): Promise<CurrenciesDocument[]> {
    return await this.CurrenciesModel.find();
  }
}
