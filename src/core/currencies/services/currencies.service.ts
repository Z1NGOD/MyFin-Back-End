import { Injectable } from '@nestjs/common';
import { CurrenciesRepository } from '@libs/db';
import { CurrencyDto } from '../dto';

@Injectable()
export class CurrenciesService {
  constructor(private readonly currenciesRepository: CurrenciesRepository) {}

  findAll() {
    return this.currenciesRepository.findAll();
  }

  create(currencyDto: CurrencyDto) {
    return this.currenciesRepository.create(currencyDto);
  }
}
