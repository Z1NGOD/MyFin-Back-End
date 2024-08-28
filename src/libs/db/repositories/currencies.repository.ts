import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrenciesDocument } from '../models';

@Injectable()
export class CurrenciesRepository {
  constructor(
    @InjectModel(Currency.name)
    private readonly CurrenciesModel: Model<Currency>,
  ) {}

  async findAll(): Promise<CurrenciesDocument[]> {
    return await this.CurrenciesModel.find();
  }

  async findById(id: string): Promise<CurrenciesDocument> {
    return await this.CurrenciesModel.findById(id);
  }
}
