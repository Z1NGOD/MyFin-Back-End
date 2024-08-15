import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserRepository,
  ExpenseRepository,
  BudgetsRepository,
} from './repositories';
import { CategoryMigration, CurrencyMigration } from './migrations';
import {
  User,
  UserSchema,
  Category,
  CategorySchema,
  Currency,
  CurrencySchema,
  Expense,
  ExpensesSchema,
  Budgets,
  BudgetsSchema,
} from './models';

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
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Currency.name,
        schema: CurrencySchema,
      },
      {
        name: Expense.name,
        schema: ExpensesSchema,
      },
      {
        name: Budgets.name,
        schema: BudgetsSchema,
      },
    ]),
  ],
  providers: [
    UserRepository,
    ExpenseRepository,
    BudgetsRepository,
    CurrencyMigration,
    CategoryMigration,
  ],
  exports: [
    MongooseModule,
    UserRepository,
    ExpenseRepository,
    BudgetsRepository,
  ],
})
export class DbModule {}
