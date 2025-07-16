import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators'

import { AuthDto, LoginDto, RefreshTokenDto } from './dto'
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
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refreshes access and refresh tokens using a valid refresh token. The refresh token should be obtained from a previous login/register response.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token obtained from previous authentication',
    examples: {
      example1: {
        summary: 'Refresh token request',
        description: 'Example of refresh token request body',
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'New JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          description: 'New JWT refresh token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Access Denied - Invalid or expired refresh token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Access Denied' },
      },
    },
  })
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
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  async getCurrentUser(@GetCurrentUser() user: any) {
    return user
  }

  @Post('validate')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate access token' })
  async validateToken(
    @GetCurrentUserId() userId: string,
    @Headers('authorization') authHeader: string,
  ): Promise<{ valid: boolean }> {
    const accessToken = authHeader?.replace('Bearer ', '')
    if (!accessToken) {
      throw new ForbiddenException('No access token provided')
    }
    const isValid = await this.authService.validateAccessToken(userId, accessToken)
    return { valid: isValid }
  }
}
