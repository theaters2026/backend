import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { AuthService } from '../auth.service'
import { IS_PUBLIC_KEY } from '../../common/decorators'

@Injectable()
export class AtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Access token not found')
    }

    let payload: any
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Invalid access token signature')
    }

    const isValid = await this.authService.validateAccessToken(payload.sub, token)
    if (!isValid) {
      throw new UnauthorizedException('Token is invalid or revoked')
    }

    request.user = payload

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = (request.headers as unknown as Record<string, string>)['authorization']
    const [type, token] = authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
