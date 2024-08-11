import { Module } from '@nestjs/common';
import { DbModule } from '@libs/db/db.module';
import { CurrenciesRepository } from '@libs/db/repositories/currencies.repository';
import { CurrenciesService } from './services/currencies.service';
import { CurrenciesController } from './controllers/currencies.controller';

@Module({
  imports: [DbModule],
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrenciesRepository],
})
export class CurrenciesModule {}
