import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpencesService } from '../services/expences.service';
import { CreateExpenceDto } from '../dto/create-expence.dto';
import { UpdateExpenceDto } from '../dto/update-expence.dto';

@Controller('expences')
export class ExpencesController {
  constructor(private readonly expencesService: ExpencesService) {}

  @Post()
  create(@Body() createExpenceDto: CreateExpenceDto) {
    return this.expencesService.create(createExpenceDto);
  }

  @Get()
  findAll() {
    return this.expencesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.expencesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenceDto: UpdateExpenceDto) {
    this.expencesService.update(id, updateExpenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.expencesService.remove(id);
  }
}
