import { Test, type TestingModule } from '@nestjs/testing';
import { ExpencesService } from '../services/expences.service';
import { ExpencesController } from './expences.controller';

describe('expencesController', () => {
  let controller: ExpencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpencesController],
      providers: [ExpencesService],
    }).compile();

    controller = module.get<ExpencesController>(ExpencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
