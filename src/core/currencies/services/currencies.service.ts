import { Injectable } from '@nestjs/common';
import { CurrenciesRepository } from '@libs/db/repositories/currencies.repository';

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {}

  findAll() {
    return this.currenciesRepository.findAll();
  }
}
