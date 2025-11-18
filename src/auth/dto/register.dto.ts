import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro público de CLIENTES
 * Solo los clientes pueden auto-registrarse desde la app.
 * Los productores deben ser creados por ADMIN.
 */
export class RegisterDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '+56912345678',
    description: 'Teléfono del cliente (opcional)',
    required: false,
  })
  @IsString()
  telefono?: string;

  @ApiProperty({
    example: 'Av. Principal 123, Santiago',
    description: 'Dirección del cliente (opcional)',
    required: false,
  })
  @IsString()
  direccion?: string;
}
