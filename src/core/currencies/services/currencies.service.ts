import { Injectable } from '@nestjs/common';
import { CurrenciesRepository } from '@libs/db';

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {}

  findAll() {
    return this.currenciesRepository.findAll();
  }
}
