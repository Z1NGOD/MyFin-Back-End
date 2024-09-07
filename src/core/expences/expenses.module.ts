import { Module } from '@nestjs/common';
import { DbModule } from '@libs/db';
import { CategoriesModule } from '@core/categories/categories.module';
import { CurrenciesModule } from '@core/currencies/currencies.module';
import { ExpensesService } from './services/expenses.service';
import { ExpensesController } from './controllers/expenses.controller';

@Module({
  imports: [DbModule, CategoriesModule, CurrenciesModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
