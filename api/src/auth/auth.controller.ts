import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AuthService } from './auth.service.js'
import { AuthResponseDto } from './dto/auth-response.dto.js'
import { LoginDto } from './dto/login.dto.js'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida usuario y contraseña, y devuelve un JWT.',
  })
  @ApiOkResponse({ description: 'Credenciales correctas', type: AuthResponseDto })
  @ApiUnauthorizedResponse({
    description:
      'Usuario inexistente o contraseña incorrecta. El mensaje es el mismo en ambos casos, a propósito.',
    schema: {
      example: { message: 'Credenciales inválidas', error: 'Unauthorized', statusCode: 401 },
    },
  })
  @ApiBadRequestResponse({
    description: 'Campos faltantes, vacíos o propiedades no declaradas',
    schema: {
      example: {
        message: ['El usuario es obligatorio'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.auth.login(dto)
  }
}
