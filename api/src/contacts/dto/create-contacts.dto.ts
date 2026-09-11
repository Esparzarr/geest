import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator'

export class CreateContactDto {
  @ApiProperty({ example: 'Juan diaz' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string

  @ApiProperty({ example: 'ejemplo@gmail.com' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50, { message: 'El correo no puede superar los 50 caracteres' })
  @IsEmail({}, { message: 'El correo debe ser valido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string

  @ApiProperty({ example: '3123123121', required: false })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  // Se recibe como string, pero solo se aceptan 10 dígitos
  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
  @IsOptional()
  phone?: string

  @ApiProperty({ example: '01a09163-6374-76a8-9d22-d9426e362f3e' })
  @IsUUID('7', { message: 'El departamento debe ser un identificador válido' })
  @IsNotEmpty({ message: 'El departamento es obligatorio' })
  department: string
}
