import { Controller, Body, Post, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Some property is wrong',
  })
  @Post('registration')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }
}
