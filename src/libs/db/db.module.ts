import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_URI,
        retryAttempts: 5,
        retryDelay: 2000,
      }),
    }),
  ],
})
export class DbModule {}
