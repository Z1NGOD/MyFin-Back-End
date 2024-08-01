import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto, UpdateExpenseDto } from '@core/expences/dto';
import * as schemas from '../models';
import { ExpensesDocument } from '../models/expenses.schema';

interface AggregateResult {
  expenses: ExpensesDocument[];
  totalAmount: [{ count: number }] | [];
  sum: [{ total: number }] | [];
}

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectModel(schemas.Expense.Expense.name)
    private readonly ExpenseModel: Model<schemas.Expense.Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const expense = new this.ExpenseModel(createExpenseDto);
    return expense.save();
  }

  async findAll(): Promise<{
    expenses: ExpensesDocument[];
    totalAmount: number;
    sum: number;
  }> {
    const results = await this.ExpenseModel.aggregate<AggregateResult>([
      {
        $facet: {
          expenses: [{ $match: {} }],
          totalAmount: [{ $count: 'count' }],
          sum: [{ $group: { _id: null, total: { $sum: '$amount' } } }],
        },
      },
    ]).exec();

    if (results.length === 0) {
      return { expenses: [], totalAmount: 0, sum: 0 };
    }

    const result = results[0];

    return {
      expenses: result.expenses,
      totalAmount: result.totalAmount[0]?.count ?? 0,
      sum: result.sum[0]?.total ?? 0,
    };
  }

  async getExpensesByCategory(): Promise<
    [{ category: string; totalAmount: number }]
  > {
    const result = await this.ExpenseModel.aggregate([
      {
        $group: {
          _id: '$category',
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: 1,
        },
      },
    ]).exec();

    return result as [{ category: string; totalAmount: number }];
  }

  async findById(id: string): Promise<ExpensesDocument> {
    return this.ExpenseModel.findById(id);
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpensesDocument> {
    if (Object.keys(updateExpenseDto).length === 0) {
      throw new BadRequestException('No update fields provided');
    }
    const updatedExpense = this.ExpenseModel.findByIdAndUpdate(
      id,
      updateExpenseDto,
      { new: true },
    );
    return updatedExpense;
  }

  async delete(id: string) {
    return this.ExpenseModel.findByIdAndDelete(id);
  }
}
