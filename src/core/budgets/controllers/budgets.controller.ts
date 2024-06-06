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
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@libs/security';
import { BudgetsService } from '../services/budgets.service';
import { CreateBudgetDto, UpdateBudgetDto } from '../dto';

@ApiTags('Budgets')
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

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
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetsService.findOne(id);
  }

  @ApiBody({ type: CreateBudgetDto })
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
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard)
  @Post('create')
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
  @ApiBearerAuth()
  @UseGuards(AccessTokenAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetsService.update(id, updateBudgetDto);
  }
}
