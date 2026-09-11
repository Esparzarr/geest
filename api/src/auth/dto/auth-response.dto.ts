import { ApiProperty } from '@nestjs/swagger'

export class AuthUserDto {
  @ApiProperty({
    example: '01a08de5-ef21-7c97-bc87-920a538aeda1',
    description: 'Identificador del usuario',
  })
  id: string

  @ApiProperty({ example: 'testuser' })
  username: string
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YWEyZmZmNTQwYWRl...',
    description: 'JWT para autenticar peticiones posteriores',
  })
  access_token: string

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto
}
