import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

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

  @ApiPropertyOptional({ example: 10, description: 'Cuántos contactos devolver. Por defecto 10' })
  @Type(() => Number)
  @Max(100, { message: 'El límite no puede superar 100' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @IsInt({ message: 'El límite debe ser un número entero' })
  @IsOptional()
  limit?: number

  @ApiPropertyOptional({ example: 0, description: 'Cuántos contactos saltar. Por defecto 0' })
  @Type(() => Number)
  @Min(0, { message: 'El desplazamiento no puede ser negativo' })
  @IsInt({ message: 'El desplazamiento debe ser un número entero' })
  @IsOptional()
  offset?: number
}
