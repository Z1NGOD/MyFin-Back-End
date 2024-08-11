import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from '../services/currencies.service';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }
}
