import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as argon from 'argon2'

import { Tokens } from '../types'
import { UserService } from './user.service'

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async generateTokens(userId: string, username: string, role: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.config.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwt.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async generateUserTokens(user: User): Promise<Tokens> {
    if (!user.id || !user.username || !user.role) {
      throw new Error('User data is incomplete')
    }

    const tokens = await this.generateTokens(user.id, user.username, user.role)

    await this.saveTokensToDatabase(user.id, tokens.access_token, tokens.refresh_token)

    return tokens
  }

  async saveTokensToDatabase(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedAccessToken = await argon.hash(accessToken)
    const hashedRefreshToken = await argon.hash(refreshToken)

    await this.userService.updateUserTokens(userId, hashedAccessToken, hashedRefreshToken)
  }

  async verifyRefreshToken(refreshToken: string): Promise<any> {
    try {
      return await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new ForbiddenException('Invalid refresh token')
    }
  }

  async validateAccessToken(userId: string, accessToken: string): Promise<boolean> {
    const user = await this.userService.getUserTokenData(userId)

    if (!user || !user.hashedAccessToken) return false

    return await argon.verify(user.hashedAccessToken, accessToken)
  }

  async validateRefreshToken(user: User, refreshToken: string): Promise<boolean> {
    if (!user.hashedRt) return false

    return await argon.verify(user.hashedRt, refreshToken)
  }
}
