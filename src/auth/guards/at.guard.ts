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

    // Сначала пытаемся получить токен из заголовка
    let token = this.extractTokenFromHeader(request)

    // Если токена нет в заголовке, пытаемся получить из сессии
    if (!token) {
      token = this.extractTokenFromSession(request)
    }

    if (!token) {
      throw new UnauthorizedException('Access token not found in header or session')
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

  /**
   * Извлекает токен доступа из сессии
   * @param request - объект запроса
   * @returns токен доступа или undefined
   */
  private extractTokenFromSession(request: any): string | undefined {
    if (!request.session || !request.session.tokens) {
      return undefined
    }

    return request.session.tokens.access_token
  }
}
