import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: 'Nombre de usuario' })
  @IsString({ message: 'El usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  username: string

  @ApiProperty({ example: 'Test1234!', description: 'Contraseña en texto plano' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string
}
