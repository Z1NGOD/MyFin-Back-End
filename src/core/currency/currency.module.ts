import { Module } from '@nestjs/common';
import { CurrencyService } from './services/currency.service';
import { CurrencyController } from './controllers/currency.controller';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
})
export class CurrencyModule {}
