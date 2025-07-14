import { ForbiddenException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'

import { AuthDto, LoginDto } from './dto'
import { Tokens } from './types'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signupLocal(dto: AuthDto, session?: any): Promise<Tokens> {
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

    await this.saveTokensToDatabase(newUser.id, tokens.access_token, tokens.refresh_token)

    if (session) {
      this.saveTokensToSession(session, tokens, newUser)
    }

    return tokens
  }

  async signinLocal(dto: LoginDto, session?: any): Promise<Tokens> {
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

    await this.saveTokensToDatabase(user.id, tokens.access_token, tokens.refresh_token)

    if (session) {
      this.saveTokensToSession(session, tokens, user)
    }

    return tokens
  }

  async login(dto: LoginDto, session?: any): Promise<Tokens> {
    return this.signinLocal(dto, session)
  }

  async logout(userId: string, session?: any): Promise<boolean> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: null,
        hashedAccessToken: null,
      },
    })

    if (session) {
      this.clearTokensFromSession(session)
    }

    return true
  }

  async refreshTokens(refreshToken: string, session?: any): Promise<Tokens> {
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

    await this.saveTokensToDatabase(user.id, tokens.access_token, tokens.refresh_token)

    if (session) {
      this.saveTokensToSession(session, tokens, user)
    }

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

  /**
   * @param session - объект сессии
   * @param tokens - токены доступа и обновления
   * @param user - данные пользователя
   */
  private saveTokensToSession(session: any, tokens: Tokens, user: User): void {
    session.tokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    }

    session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
  }

  /**
   * @param session - объект сессии
   */
  private clearTokensFromSession(session: any): void {
    if (session.tokens) {
      delete session.tokens
    }
    if (session.user) {
      delete session.user
    }
  }

  /**
   * @param userId - ID пользователя
   * @param accessToken - токен доступа
   * @param refreshToken - токен обновления
   */
  private async saveTokensToDatabase(
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

  /**
   * @param userId - ID пользователя
   * @param username - имя пользователя
   * @param role - роль пользователя
   * @returns объект с токенами
   */
  private async getTokens(userId: string, username: string, role: string): Promise<Tokens> {
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
}
