import { ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthDto, LoginDto } from '../dto'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    })
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findExistingUser(dto: AuthDto): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, ...(dto.email ? [{ email: dto.email }] : [])],
      },
    })
  }

  async createUser(dto: AuthDto): Promise<User> {
    const hashedPassword = await argon.hash(dto.password)

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        hash: hashedPassword,
        role: 'user',
      },
    })
  }

  async validateUserCredentials(dto: LoginDto): Promise<User> {
    const user = await this.findUserByUsername(dto.username)

    if (!user) throw new ForbiddenException('Access Denied')

    const passwordMatches = await argon.verify(user.hash, dto.password)
    if (!passwordMatches) throw new ForbiddenException('Access Denied')

    return user
  }

  async clearUserTokens(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRt: null,
        hashedAccessToken: null,
      },
    })
  }

  async updateUserTokens(
    userId: string,
    hashedAccessToken: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedAccessToken,
        hashedRt: hashedRefreshToken,
      },
    })
  }

  async getUserTokenData(userId: string): Promise<{ hashedAccessToken: string | null } | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { hashedAccessToken: true },
    })
  }
}
