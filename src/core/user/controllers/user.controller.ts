import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all Users',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @ReturnType (UserResponseDto) изменять дто на UserResponseDto БЕЗ ПАРОЛЯ!
  // использовать внутри дто @Expose library Class-Transformer
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find one user by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Can not find this user by id!',
  })
  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.userService.findOne(_id);
  }

  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.RESET_CONTENT,
    description: 'User updated successfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Some property is wrong',
  })
  @Patch(':_id')
  update(@Param('_id') _id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(_id, updateUserDto);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted user by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Can not deleted this user by id!',
  })
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.userService.remove(_id);
  }
}
