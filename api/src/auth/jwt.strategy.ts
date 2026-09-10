import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../users/users.service.js'
import { AuthUserDto } from './dto/auth-response.dto.js'

interface JwtPayload {
  sub: string
  username: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  /** Lo que devuelve aquí queda disponible como request.user. */
  async validate(payload: JwtPayload): Promise<AuthUserDto> {
    // Se relee el usuario para que un token de una cuenta borrada deje de servir.
    const user = await this.users.findById(payload.sub)
    if (!user) throw new UnauthorizedException('Token inválido')
    return { id: user.id as string, username: user.username }
  }
}
