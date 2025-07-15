import { ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { AuthDto, LoginDto } from '../dto'
import { Tokens } from '../types'
import { TokenService } from './token.service'
import { UserService } from './user.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const existingUser = await this.userService.findExistingUser(dto)

    if (existingUser) {
      throw new ForbiddenException('Credentials already taken')
    }

    const newUser = await this.userService.createUser(dto)

    return this.tokenService.generateUserTokens(newUser)
  }

  async signinLocal(dto: LoginDto): Promise<Tokens> {
    const user = await this.userService.validateUserCredentials(dto)

    return this.tokenService.generateUserTokens(user)
  }

  async login(dto: LoginDto): Promise<Tokens> {
    return this.signinLocal(dto)
  }

  async logout(userId: string): Promise<boolean> {
    await this.userService.clearUserTokens(userId)

    return true
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is required')
    }

    const decoded = await this.tokenService.verifyRefreshToken(refreshToken)

    const userId = decoded?.sub
    if (!userId) {
      throw new ForbiddenException('User ID not found in refresh token')
    }

    const user = await this.userService.findUserById(userId)

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied')
    }

    const refreshTokenMatches = await this.tokenService.validateRefreshToken(user, refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    return this.tokenService.generateUserTokens(user)
  }

  async validateUser(dto: AuthDto): Promise<User> {
    return this.userService.validateUser(dto)
  }

  async validateAccessToken(userId: string, accessToken: string): Promise<boolean> {
    return this.tokenService.validateAccessToken(userId, accessToken)
  }
}
