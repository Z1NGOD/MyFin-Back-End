import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrencyDto } from '@core/currencies/dto';
import { Currency, CurrenciesDocument } from '../models';

@Injectable()
export class CurrenciesRepository {
  constructor(
    @InjectModel(Currency.name)
    private readonly CurrenciesModel: Model<Currency>,
  ) {}

  async create(currencyDto: CurrencyDto): Promise<CurrenciesDocument> {
    return await this.CurrenciesModel.create(currencyDto);
  }

  async findAll(): Promise<CurrenciesDocument[]> {
    return await this.CurrenciesModel.find();
  }

  async findById(id: string): Promise<CurrenciesDocument> {
    return await this.CurrenciesModel.findById(id);
  }
}
