import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto, UpdateExpenseDto } from '@core/expences/dto';
import { Expense, ExpensesDocument } from '../models';

interface EpxnesesTotalMoneyAmount {
  amount: number;
}

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectModel(Expense.name)
    private readonly ExpenseModel: Model<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return await this.ExpenseModel.create(createExpenseDto);
  }

  async calculateAmount(userId: string): Promise<number> {
    const id = new Types.ObjectId(userId);
    const result = await this.ExpenseModel.aggregate<EpxnesesTotalMoneyAmount>([
      { $match: { userId: id } },
      {
        $group: {
          _id: null,
          amount: { $sum: '$amount' },
        },
      },
    ]).exec();

    return result[0]?.amount || 0;
  }

  async findAll(
    userId: string,
    limit: string,
    page: string,
  ): Promise<{
    expenses: ExpensesDocument[];
    totalCount: number;
  }> {
    const id = new Types.ObjectId(userId);
    const limitInt = Number(limit);
    const pageInt = Number(page);
    const skip = limitInt * (pageInt - 1);

    const [expenses, totalCount] = await Promise.all([
      this.ExpenseModel.aggregate([
        { $match: { userId: id } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitInt },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'currencies',
            localField: 'currencyId',
            foreignField: '_id',
            as: 'currency',
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            amount: 1,
            date: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            category: { $arrayElemAt: ['$category', 0] },
            currency: { $arrayElemAt: ['$currency', 0] },
          },
        },
      ]).exec(),
      this.ExpenseModel.countDocuments({ userId: id }),
    ]);

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
