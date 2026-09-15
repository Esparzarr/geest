import { ApiProperty } from '@nestjs/swagger'

export class DepartmentDto {
  @ApiProperty({ example: '01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04' })
  id: string

  @ApiProperty({ example: 'Contabilidad' })
  name: string
}

export class ContactResponseDto {
  @ApiProperty({ example: '01a08e10-3c2b-7d41-9a6f-5e2b8c7d1f04' })
  id: string

  @ApiProperty({ example: 'Luis daniel' })
  name: string

  @ApiProperty({ example: 'test@gmail.com' })
  email: string

  @ApiProperty({ example: '3123123122', required: false })
  phone?: string

  @ApiProperty({ type: DepartmentDto })
  department: DepartmentDto

  @ApiProperty({ example: '2026-09-11T02:32:16.840Z' })
  createdAt: Date

  @ApiProperty({ example: '2026-09-11T02:32:16.840Z' })
  updatedAt: Date
}

export class ContactsPageDto {
  @ApiProperty({ type: [ContactResponseDto] })
  data: ContactResponseDto[]

  @ApiProperty({ example: 1000, description: 'Total de contactos que cumplen los filtros' })
  total: number
}
