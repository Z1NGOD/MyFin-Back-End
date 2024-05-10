import { Injectable, Logger } from '@nestjs/common';
import { CreateExpenceDto } from '../dto/create-expence.dto';
import { UpdateExpenceDto } from '../dto/update-expence.dto';

@Injectable()
export class ExpencesService {
  create(createExpenceDto: CreateExpenceDto) {
    return createExpenceDto;
  }

  findAll() {
    return `This action returns all expences`;
  }

  findOne(id: number) {
    return id;
  }

  update(id: string, updateExpenceDto: UpdateExpenceDto) {
    Logger.log(id);
    Logger.log(updateExpenceDto);
  }

  remove(id: number) {
    return id;
  }
}
