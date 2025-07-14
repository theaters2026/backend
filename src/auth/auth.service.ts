import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'

import { AuthDto, LoginDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<{ access_token: string; refresh_token: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, ...(dto.email ? [{ email: dto.email }] : [])],
      },
    })

    if (existingUser) {
      throw new ForbiddenException('Credentials already taken')
    }

    const hashedPassword = await argon.hash(dto.password)

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        hash: hashedPassword,
        role: 'user',
      },
    })
    if (!newUser.id || !newUser.username || !newUser.role) {
      throw new Error('User data is incomplete')
    }

    const tokens = await this.getTokens(newUser.id, newUser.username, newUser.role)
    await this.saveTokens(newUser.id, tokens.access_token, tokens.refresh_token)

    return tokens
  }

  async signinLocal(dto: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    })

    if (!user) throw new ForbiddenException('Access Denied')

    const passwordMatches = await argon.verify(user.hash, dto.password)
    if (!passwordMatches) throw new ForbiddenException('Access Denied')
    if (!user.id || !user.username || !user.role) {
      throw new Error('User data is incomplete')
    }
    const tokens = await this.getTokens(user.id, user.username, user.role)
    await this.saveTokens(user.id, tokens.access_token, tokens.refresh_token)

    return tokens
  }

  async login(dto: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
    return this.signinLocal(dto)
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: null,
        hashedAccessToken: null,
      },
    })
    return true
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token is required')
    }

    let decoded
    try {
      decoded = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token')
    }

    const userId = decoded?.sub
    if (!userId) {
      throw new ForbiddenException('User ID not found in refresh token')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access Denied')
    }

    const refreshTokenMatches = await argon.verify(user.hashedRt, refreshToken)
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    }

    if (!user.id || !user.username || !user.role) {
      throw new Error('User data is incomplete')
    }

    const tokens = await this.getTokens(user.id, user.username, user.role)
    await this.saveTokens(user.id, tokens.access_token, tokens.refresh_token)

    return tokens
  }

  async validateUser(dto: AuthDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    })

    if (!user) throw new ForbiddenException('Access Denied')

    const passwordMatches = await argon.verify(user.hash, dto.password)
    if (!passwordMatches) throw new ForbiddenException('Access Denied')

    return user
  }

  async validateAccessToken(userId: string, accessToken: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { hashedAccessToken: true },
    })

    if (!user || !user.hashedAccessToken) return false

    return argon.verify(user.hashedAccessToken, accessToken)
  }

  private async saveTokens(
    userId: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedAccessToken = await argon.hash(accessToken)
    const hashedRefreshToken = await argon.hash(refreshToken)

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedAccessToken,
        hashedRt: hashedRefreshToken,
      },
    })
  }

  private async getTokens(
    userId: string,
    username: string,
    role: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
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
          sub: userId, // Use 'sub' here as well for consistency
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
}
