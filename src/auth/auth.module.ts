import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { PrismaModule } from '../prisma/prisma.module'
import { AuthController } from './auth.controller'
import { AtGuard, RtGuard } from './guards'
import { AuthService, TokenService, UserService } from './services'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
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
