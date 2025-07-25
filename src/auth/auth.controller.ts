import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators'
import { AuthDto, LoginDto, RefreshTokenDto, UserInfoDto, ValidateTokenDto } from './dto'
import { AtGuard, RtGuard } from './guards'
import { Tokens } from './types'
import { AuthService } from './services'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 403, description: 'Credentials already taken' })
  async signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 403, description: 'Access Denied' })
  async login(@Body() dto: LoginDto): Promise<Tokens> {
    return this.authService.login(dto)
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: 403, description: 'Access Denied - Invalid or expired refresh token' })
  async refreshTokens(@Body() dto: RefreshTokenDto): Promise<Tokens> {
    if (!dto.refreshToken) {
      throw new ForbiddenException('Refresh token is required')
    }
    return this.authService.refreshTokens(dto.refreshToken)
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, description: 'Returns current user data', type: UserInfoDto })
  async getCurrentUser(@GetCurrentUser() user: UserInfoDto): Promise<UserInfoDto> {
    return user
  }

  @Post('validate')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate access token' })
  @ApiResponse({ status: 200, description: 'Token validation result' })
  @ApiResponse({ status: 403, description: 'Invalid or missing access token' })
  async validateToken(
    @Body() dto: ValidateTokenDto,
    @GetCurrentUserId() userId: string,
  ): Promise<{ valid: boolean }> {
    const isValid = await this.authService.validateAccessToken(userId, dto.accessToken)
    return { valid: isValid }
  }
}
