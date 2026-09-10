import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthUserDto } from './dto/auth-response.dto.js'

/** Extrae el usuario autenticado que la JwtStrategy dejó en la petición. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserDto => {
    return ctx.switchToHttp().getRequest<{ user: AuthUserDto }>().user
  },
)
