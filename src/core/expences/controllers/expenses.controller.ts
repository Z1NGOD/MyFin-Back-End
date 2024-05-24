import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiBody({ type: [CreateExpenseDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cant create',
  })
  @Post('create')
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cant update',
  })
  @Patch('update:id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Was not possible',
  })
  @Delete('delete:id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
