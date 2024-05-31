import { Module } from '@nestjs/common';
import { DbModule } from '../../libs/db/db.module';
import { BudgetsService } from './services/budgets.service';
import { BudgetsController } from './controllers/budgets.controller';

@Module({
  imports: [DbModule],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}
