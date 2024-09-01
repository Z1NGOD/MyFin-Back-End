import {
  Controller,
  Body,
  Post,
  HttpStatus,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@core/user/dto';
import { AccessTokenAuthGuard, RefreshTokenAuthGuard } from '@libs/security';
import { AuthService } from '../services';
import { LoginUserDto } from '../dto';
import { RequestUser } from '../interfaces';
import { TokensDto } from '../dto/tokens.dto';
import { UserEntity } from '../entity/user.entity';

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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User already exists',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.registration(createUserDto);
    const parsedUser = new UserEntity({
      _id: result.user._id.toString(),
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      password: result.user.password,
    });
    const accessToken = result.accessToken;
    const refreshToken = result.refreshToken;
    return { user: parsedUser, accessToken, refreshToken };
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
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const result = await this.authService.login(loginUserDto);
    const parsedUser = new UserEntity({
      _id: result.user._id.toString(),
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
      password: result.user.password,
    });
    const accessToken = result.accessToken;
    const refreshToken = result.refreshToken;
    return { user: parsedUser, accessToken, refreshToken };
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
