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
import { CategoriesService } from '../services/categories.service';
import { CategoryDto } from '../dto';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AccessTokenAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved all categories',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No categories found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully created a category',
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
  create(@Body() categoryDto: CategoryDto) {
    return this.categoriesService.create(categoryDto);
  }
}
