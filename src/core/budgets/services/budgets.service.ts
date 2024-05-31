import { Injectable } from '@nestjs/common';
import { BudgetsRepository } from '../../../libs/db/repositories';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private readonly budgetsRepository: BudgetsRepository) {}
  create(createBudgetDto: CreateBudgetDto) {
    return this.budgetsRepository.create(createBudgetDto);
  }

  findOne(id: string) {
    return this.budgetsRepository.findById(id);
  }

  update(id: string, updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsRepository.update(id, updateBudgetDto);
  }
}
