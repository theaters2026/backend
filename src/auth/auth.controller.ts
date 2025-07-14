import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators'

import { AuthService } from './auth.service'
import { AuthDto, LoginDto } from './dto'
import { AtGuard, RtGuard } from './guards'
import { Tokens } from './types'

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
  async signup(@Body() dto: AuthDto, @Req() request: FastifyRequest): Promise<Tokens> {
    return this.authService.signupLocal(dto, request.session)
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 403, description: 'Access Denied' })
  async login(@Body() dto: LoginDto, @Req() request: FastifyRequest): Promise<Tokens> {
    return this.authService.login(dto, request.session)
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(
    @GetCurrentUserId() userId: string,
    @Req() request: FastifyRequest,
  ): Promise<boolean> {
    return this.authService.logout(userId, request.session)
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: 403, description: 'Access Denied' })
  async refreshTokens(
    @Body('refreshToken') refreshToken: string,
    @Req() request: FastifyRequest,
  ): Promise<Tokens> {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is required')
    }
    return this.authService.refreshTokens(refreshToken, request.session)
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
