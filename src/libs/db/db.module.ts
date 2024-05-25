import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './models/category.schema';
import { Currency, CurrencySchema } from './models/currency.schema';
import { ExpensesSchema, Expense } from './models/expenses.schema';
import { CategoryMigration, CurrencyMigration } from './migrations';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_URI,
        retryAttempts: 2,
        retryDelay: 2000,
      }),
    }),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Currency.name, schema: CurrencySchema },
      { name: Expense.name, schema: ExpensesSchema },
    ]),
  ],
  providers: [CurrencyMigration, CategoryMigration],
  exports: [MongooseModule],
})
export class DbModule {}
