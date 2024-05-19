import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateExpenseDto } from '@core/expences/dto/update-expense.dto';
import { CreateExpenseDto } from '@core/expences/dto/create-expense.dto';
import { Expense, ExpensesDocument } from '../models/expenses.schema';

@Injectable()
export class ExpenseRepository {
  constructor(
    @InjectModel(Expense.name) private readonly ExpenseModel: Model<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const expense = new this.ExpenseModel(createExpenseDto);
    return expense.save();
  }

  async findAll(): Promise<ExpensesDocument[]> {
    return this.ExpenseModel.find().exec();
  }

  async findById(_id: string): Promise<ExpensesDocument> {
    return this.ExpenseModel.findById(_id);
  }

  async update(
    _id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpensesDocument> {
    const updatedExpense = this.ExpenseModel.findByIdAndUpdate(
      _id,
      updateExpenseDto,
      { new: true },
    );
    return updatedExpense;
  }

  async delete(_id: string) {
    return this.ExpenseModel.findByIdAndDelete(_id);
  }
}
