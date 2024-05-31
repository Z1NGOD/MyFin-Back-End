import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto } from '@core/budgets/dto/create-budget.dto';
import { UpdateBudgetDto } from '@core/budgets/dto/update-budget.dto';
import * as schemas from '../models';
import { BudgetsDocument } from '../models/budgets.schema';

@Injectable()
export class BudgetsRepository {
  constructor(
    @InjectModel(schemas.Budgets.Budgets.name)
    private readonly BudgetsModel: Model<schemas.Budgets.Budgets>,
  ) {}

  create(createBudgetDto: CreateBudgetDto) {
    const budget = new this.BudgetsModel(createBudgetDto);
    return budget.save();
  }

  findById(id: string): Promise<BudgetsDocument> {
    return this.BudgetsModel.findById(id);
  }

  update(id: string, updateBudgetDto: UpdateBudgetDto) {
    return this.BudgetsModel.findByIdAndUpdate(id, updateBudgetDto);
  }
}
