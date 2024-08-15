import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto, UpdateExpenseDto } from '@core/expences/dto';
import { Expense, ExpensesDocument } from '../models';

interface EpxneseAndTotalCount {
  expenses: ExpensesDocument[];
  totalCount: number;
}

interface ExpensesAmount {
  _id: null;
  total: number;
}

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly ExpenseModel: Model<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const expense = new this.ExpenseModel(createExpenseDto);
    return expense.save();
  }

  async calculateExpensesAmount(userId: string): Promise<number> {
    const id = new Types.ObjectId(userId);

    const result = await this.ExpenseModel.aggregate<ExpensesAmount>([
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
    totalCount: number;
  }> {
    const id = new Types.ObjectId(userId);
    const result = await this.ExpenseModel.aggregate<EpxneseAndTotalCount>([
      { $match: { userId: id } },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          expenses: { $push: '$$ROOT' },
        },
      },
    ]).exec();

    const expenses = result[0]?.expenses || [];
    const totalCount = result[0]?.totalCount || 0;

    return {
      expenses,
      totalCount,
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
