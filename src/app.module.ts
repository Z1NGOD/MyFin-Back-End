import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './core/expences/expenses.module';
import { redisConfig } from './libs/redis/configs/redis.config';
import { DbModule } from './libs/db/db.module';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './libs/redis/redis.module';
import { CachingModule } from './libs/cache/caching.module';
import { UserModule } from './core/user/user.module';
import { BudgetsModule } from './core/budgets/budgets.module';
import { validate } from './envValidation/env.vaidation';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, isGlobal: true, load: [redisConfig] }),
    DbModule,
    AuthModule,
    RedisModule,
    CachingModule,
    UserModule,
    ExpensesModule,
    BudgetsModule,
  ],
})
export class AppModule {}
