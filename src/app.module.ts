import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { redisConfig } from './libs/redis/configs/redis.config';
import { DbModule } from './libs/db/db.module';
import { AuthModule } from './core/auth/auth.module';
import { RedisModule } from './libs/redis/redis.module';
import { CachingModule } from './libs/cache/caching.module';
import { ExpencesModule } from './core/expences/expences.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [redisConfig] }),
    DbModule,
    AuthModule,
    RedisModule,
    CachingModule,
    ExpencesModule,
  ],
})
export class AppModule {}
