import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

/**
 * DTO para registro de usuarios (CLIENTE o PRODUCTOR)
 * Crea User + Profile correspondiente según el rol
 */
export class RegisterDto {
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
    example: Role.CLIENTE,
    description: 'Rol del usuario (CLIENTE o PRODUCTOR)',
    enum: Role,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  // Campos comunes (se usan según el rol)
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo (si CLIENTE) o nombre de contacto (si PRODUCTOR)',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Av. Principal 123, Lima',
    description: 'Dirección',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  // Campos específicos para PRODUCTOR
  @ApiPropertyOptional({
    example: 'Frutas del Valle',
    description: 'Nombre del negocio (solo para PRODUCTOR)',
  })
  @ValidateIf((o) => o.role === Role.PRODUCTOR)
  @IsNotEmpty({ message: 'nombreNegocio es requerido para PRODUCTOR' })
  @IsString()
  nombreNegocio?: string;

  @ApiPropertyOptional({
    example: 'Producimos frutas orgánicas de calidad',
    description: 'Descripción del negocio (solo para PRODUCTOR)',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
