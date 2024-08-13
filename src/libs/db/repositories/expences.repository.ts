import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto, UpdateExpenseDto } from '@core/expences/dto';
import * as schemas from '../models';
import { ExpensesDocument } from '../models/expenses.schema';

interface AggregateResult {
  expenses: ExpensesDocument[];
  totalAmount: number;
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

  async calculateExpensesAmount(userId: string): Promise<number> {
    const id = new Types.ObjectId(userId);

    const result = await this.ExpenseModel.aggregate<{
      _id: null;
      total: number;
    }>([
      {
        $match: { userId: id },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]).exec();

    return result[0]?.total ?? 0;
  }

  async findAll(userId: string): Promise<{
    expenses: ExpensesDocument[];
    totalAmount: number;
  }> {
    const id = new Types.ObjectId(userId);
    const result = await this.ExpenseModel.aggregate<AggregateResult>([
      { $match: { userId: id } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: 1 },
          expenses: { $push: '$$ROOT' },
        },
      },
    ]).exec();

    const expenses = result[0]?.expenses || [];
    const totalAmount = result[0]?.totalAmount || 0;

    return {
      expenses,
      totalAmount,
    };
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
