import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CategoriesRepository,
  CurrenciesRepository,
  ExpenseRepository,
} from '@libs/db';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';
import { DraftExpenseDto } from '../dto/draft-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoriesRepository,
    private readonly currencyRepository: CurrenciesRepository,
  ) {}

  async create(draftExepnseDto: DraftExpenseDto) {
    const category = await this.categoryRepository.findById(
      draftExepnseDto.categoryId,
    );
    if (!category) {
      throw new BadRequestException('No such category');
    }

    const currency = await this.currencyRepository.findById(
      draftExepnseDto.currencyId,
    );
    if (!currency) {
      throw new BadRequestException('No such currency');
    }

    const createExpenseDto: CreateExpenseDto = {
      userId: draftExepnseDto.userId,
      category: category.name,
      currency: currency.symbol,
      amount: draftExepnseDto.amount,
      date: draftExepnseDto.date,
      details: draftExepnseDto.details,
    };

    return this.expenseRepository.create(createExpenseDto);
  }

  calculateAmount(userId: string) {
    return this.expenseRepository.calculateAmount(userId);
  }

  findAll(userId: string, limit: string, page: string) {
    return this.expenseRepository.findAll(userId, limit, page);
  }

  findOne(id: string) {
    return this.expenseRepository.findById(id);
  }

  update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  remove(id: string) {
    return this.expenseRepository.delete(id);
  }
}
