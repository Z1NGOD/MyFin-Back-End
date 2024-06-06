import { Module } from '@nestjs/common';
import { ExpenseRepository } from '@libs/db/repositories';
import { DbModule } from '@libs/db/db.module';
import { ExpensesService } from './services/expenses.service';
import { ExpensesController } from './controllers/expenses.controller';

@Module({
  imports: [DbModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpenseRepository],
})
export class ExpensesModule {}
