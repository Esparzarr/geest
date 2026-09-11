import { ApiProperty } from '@nestjs/swagger'

export class DepartmentResponseDto {
  @ApiProperty({ example: '01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04' })
  id: string

  @ApiProperty({ example: 'Recursos Humanos' })
  name: string

  @ApiProperty({ example: '2026-09-11T02:32:16.840Z' })
  createdAt: Date

  @ApiProperty({ example: '2026-09-11T02:32:16.840Z' })
  updatedAt: Date
}
