import { ApiProperty } from '@nestjs/swagger'

export class AuthUserDto {
  @ApiProperty({ example: '6aa2fff540ade3d83f371faf', description: 'Identificador en MongoDB' })
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
