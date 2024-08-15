import { Module } from '@nestjs/common';
import { DbModule, CurrenciesRepository } from '@libs/db';
import { CurrenciesService } from './services/currencies.service';
import { CurrenciesController } from './controllers/currencies.controller';

@Module({
  imports: [DbModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrenciesRepository],
})
export class CurrenciesModule {}
