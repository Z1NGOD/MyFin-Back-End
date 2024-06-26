import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@libs/security';
import { ExpensesService } from '../services/expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(AccessTokenAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all expenses',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No expenses found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the expense',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Expense not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Expense created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request body',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('create')
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @ApiBody({ type: UpdateExpenseDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request body or expense not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Expense deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid expense ID or expense not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
