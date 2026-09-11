import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Recursos Humanos' })
  // Quita los espacios de los extremos antes de validar
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  // Con stopAtFirstError se validan de abajo hacia arriba
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string
}
