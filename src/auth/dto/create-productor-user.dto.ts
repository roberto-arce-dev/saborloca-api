import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para que ADMIN cree usuarios PRODUCTORES
 * Solo el administrador puede crear productores.
 */
export class CreateProductorUserDto {
  @ApiProperty({
    example: 'Agrícola Valle Verde',
    description: 'Nombre del productor',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'productor@valleverde.cl',
    description: 'Email del productor',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña inicial (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Región de Valparaíso',
    description: 'Ubicación del productor',
  })
  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Teléfono del productor',
  })
  @IsNotEmpty()
  @IsString()
  telefono: string;
}
