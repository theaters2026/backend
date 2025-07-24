import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { PrismaModule } from '../prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AtGuard, RtGuard } from './guards'
import { AuthService, TokenService, UserService } from './services'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ConfigModule,
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserService,
    AtGuard,
    RtGuard,
    {
      provide: 'APP_GUARD',
      useClass: AtGuard,
    },
  ],
  exports: [AuthService, JwtModule, AtGuard],
})
export class AuthModule {}
