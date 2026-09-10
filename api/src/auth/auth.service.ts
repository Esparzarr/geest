import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service.js'
import { AuthResponseDto, AuthUserDto } from './dto/auth-response.dto.js'
import { LoginDto } from './dto/login.dto.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.users.findByUsernameWithPassword(normalize(dto.username))

    // Mismo mensaje para usuario inexistente y contraseña incorrecta:
    // distinguirlos permitiría averiguar qué usuarios están registrados.
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const profile: AuthUserDto = { id: user.id as string, username: user.username }

    return {
      access_token: await this.jwt.signAsync({ sub: profile.id, username: profile.username }),
      user: profile,
    }
  }
}

function normalize(username: string): string {
  return username.toLowerCase().trim()
}
