import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency } from '../models/currency.schema';
import { migrationDataJson } from '../data/currency.migration.data';

@Injectable()
export class CurrencyMigration implements OnModuleInit {
  constructor(
    @InjectModel(Currency.name) private readonly currencyModel: Model<Currency>,
  ) {}

  async onModuleInit() {
    await this.checkAndPopulateCollections();
  }

  private async checkAndPopulateCollections() {
    const count = await this.currencyModel.countDocuments();
    if (count === 0) {
      const data = migrationDataJson;
      await this.currencyModel.insertMany(data);
    }
  }
}
