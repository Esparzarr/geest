import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class FindContactsDto {
  @ApiPropertyOptional({ example: 'juan', description: 'Parte del nombre a buscar' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'La búsqueda debe ser una cadena de texto' })
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    type: [String],
    example: ['TI'],
    description: 'Uno o varios departamentos, por id o por nombre: ?department=TI&department=CA',
  })
  // Llega como texto si mandan uno y como arreglo si mandan varios: aquí siempre queda arreglo
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? undefined : Array.isArray(value) ? value : [value],
  )
  @IsString({ each: true, message: 'Cada departamento debe ser un id o un nombre' })
  @IsOptional()
  department?: string[]
}
