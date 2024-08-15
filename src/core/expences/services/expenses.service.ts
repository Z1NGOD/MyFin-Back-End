import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from '@libs/db';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.create(createExpenseDto);
  }

  findAll(userId: string) {
    return this.expenseRepository.findAll(userId);
  }

  findOne(id: string) {
    return this.expenseRepository.findById(id);
  }

  calculateExpensesAmount(userId: string) {
    return this.expenseRepository.calculateExpensesAmount(userId);
  }

  update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return this.expenseRepository.update(id, updateExpenseDto);
  }

  remove(id: string) {
    return this.expenseRepository.delete(id);
  }
}
