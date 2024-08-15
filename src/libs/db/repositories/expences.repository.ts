import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto, UpdateExpenseDto } from '@core/expences/dto';
import { Expense, ExpensesDocument } from '../models';

interface EpxnesesAndTotalCount {
  expenses: ExpensesDocument[];
  totalCount: number;
  amount: number;
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

  async findAll(
    userId: string,
    limit: string,
    page: string,
  ): Promise<{
    expenses: ExpensesDocument[];
    totalCount: number;
    amount: number;
  }> {
    const id = new Types.ObjectId(userId);
    const limitInt = Number(limit);
    const pageInt = Number(page);
    const skip = limitInt * (pageInt - 1);

    const result = await this.ExpenseModel.aggregate<EpxnesesAndTotalCount>([
      { $match: { userId: id } },
      { $limit: limitInt },
      { $skip: skip },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          expenses: { $push: '$$ROOT' },
          amount: { $sum: '$amount' },
        },
      },
    ]).exec();

    const expenses = result[0]?.expenses || [];
    const totalCount = result[0]?.totalCount || 0;
    const amount = result[0]?.amount || 0;

    return {
      expenses,
      totalCount,
      amount,
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
