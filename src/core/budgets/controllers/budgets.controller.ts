import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BudgetsService } from '../services/budgets.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { AccessTokenAuthGuard } from '../../../libs/security';

@ApiTags('Budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @ApiBody({ type: [CreateBudgetDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved budget',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No budget found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @ApiBody({ type: [CreateBudgetDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved budget',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No budget found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(createBudgetDto);
  }

  @ApiBody({ type: [CreateBudgetDto] })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved budget',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No budget found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }
}
