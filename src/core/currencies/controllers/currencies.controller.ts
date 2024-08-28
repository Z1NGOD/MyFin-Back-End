import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrenciesService } from '../services/currencies.service';
import { CurrencyDto } from '../dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Post('create')
  create(@Body() currencyDto: CurrencyDto) {
    return this.currenciesService.create(currencyDto);
  }
}
