import {
  Controller,
  Body,
  Post,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenAuthGuard, RefreshTokenAuthGuard } from '@libs/security';
import { AuthService } from '../services/auth.service';
import { LoginUserDto, CreateUserDto } from '../dto';
import { RequestUser } from '../interfaces';
import { TokensDto } from '../dto/tokens.dto';

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

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User logged in',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User was not found',
  })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBody({ type: RequestUser })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Access Token was refreshed successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is unauthorized',
  })
  @UseGuards(RefreshTokenAuthGuard)
  @Post('updateAccessToken')
  updateAccessToken(
    @Request() req: { user: RequestUser },
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.updateAccessToken(refreshToken, req.user);
  }

  @ApiBody({ type: TokensDto })
  @ApiResponse({
    status: HttpStatus.I_AM_A_TEAPOT,
    description: 'User became a teapot',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User is unauthorized',
  })
  @UseGuards(AccessTokenAuthGuard)
  @Post('logout')
  logout(@Body() tokens: TokensDto) {
    this.authService.logout(tokens.refreshToken, tokens.accessToken);
  }
}
