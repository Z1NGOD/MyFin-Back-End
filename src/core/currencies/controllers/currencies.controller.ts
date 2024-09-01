import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@libs/security';
import { CurrenciesService } from '../services/currencies.service';
import { CurrencyDto } from '../dto';

@ApiTags('Currencies')
@ApiBearerAuth()
@UseGuards(AccessTokenAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all currencies',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No currencies found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a currency',
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
  create(@Body() currencyDto: CurrencyDto) {
    return this.currenciesService.create(currencyDto);
  }
}
