import { Module } from '@nestjs/common';
import { ExpencesService } from './services/expences.service';
import { ExpencesController } from './controllers/expences.controller';

@Module({
  controllers: [ExpencesController],
  providers: [ExpencesService],
})
export class ExpencesModule {}
