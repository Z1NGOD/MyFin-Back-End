import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as schemas from '@libs/db/models';
import { AccessTokenAuthGuard } from '../../../libs/security';
import { UpdateUserDto, UserResponseDto } from '../dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all Users',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find one user by id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Can not find this user by id!',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':_id')
  async findOne(@Param('_id') _id: string) {
    return this.transfomUser(_id, await this.userService.findOne(_id));
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
  @UseGuards(AccessTokenAuthGuard)
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
  @UseGuards(AccessTokenAuthGuard)
  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.userService.remove(_id);
  }

  private transfomUser(
    userId: string,
    user: schemas.User.User,
  ): UserResponseDto {
    const { firstName, lastName, email } = user;
    return new UserResponseDto({ _id: userId, firstName, lastName, email });
  }
}
