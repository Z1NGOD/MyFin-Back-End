import {
  Controller,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@libs/security';
import { UpdateUserDto } from '../dto';
import { UserService } from '../services/user.service';

@ApiTags('User')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Something went wrong',
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Some property is wrong',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
