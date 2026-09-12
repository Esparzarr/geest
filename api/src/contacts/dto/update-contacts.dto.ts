import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator'

export class UpdateContactDto {
  @ApiProperty({ example: 'Juan diaz', required: false })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @ValidateIf((_, value) => value !== undefined)
  name?: string

  @ApiProperty({ example: 'ejemplo@gmail.com', required: false })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50, { message: 'El correo no puede superar los 50 caracteres' })
  @IsEmail({}, { message: 'El correo debe ser valido' })
  @ValidateIf((_, value) => value !== undefined)
  email?: string

  @ApiProperty({ example: '3123123121', required: false })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
  @IsOptional()
  phone?: string

  @ApiProperty({ example: '01a09163-6374-76a8-9d22-d9426e362f3e', required: false })
  @IsUUID('7', { message: 'El departamento debe ser un identificador válido' })
  @ValidateIf((_, value) => value !== undefined)
  department?: string
}
