import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from '../dto/create-currency.dto';
import { UpdateCurrencyDto } from '../dto/update-currency.dto';

@Injectable()
export class CurrencyService {
  create(createCurrencyDto: CreateCurrencyDto) {
    return createCurrencyDto;
  }

  findAll() {
    return `This action returns all currency`;
  }

  findOne(id: number) {
    return id;
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return { id, updateCurrencyDto };
  }

  remove(id: number) {
    return id;
  }
}
