import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from '@libs/db/repositories';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.create(createExpenseDto);
  }

  findAll() {
    return this.expenseRepository.findAll();
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
