import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as schemas from './models';
import * as repositories from './repositories';
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
      {
        name: schemas.User.User.name,
        schema: schemas.User.UserSchema,
      },
      {
        name: schemas.Category.Category.name,
        schema: schemas.Category.CategorySchema,
      },
      {
        name: schemas.Currency.Currency.name,
        schema: schemas.Currency.CurrencySchema,
      },
      {
        name: schemas.Expense.Expense.name,
        schema: schemas.Expense.ExpensesSchema,
      },
    ]),
  ],
  providers: [
    repositories.UserRepository,
    repositories.ExpenseRepository,
    CurrencyMigration,
    CategoryMigration,
  ],
  exports: [
    MongooseModule,
    repositories.UserRepository,
    repositories.ExpenseRepository,
  ],
})
export class DbModule {}
