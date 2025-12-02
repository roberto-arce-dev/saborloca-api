import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class UbicacionDto {
  @ApiProperty({ example: 'Point', description: 'Tipo de geometría GeoJSON' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Point'])
  type: string;

  @ApiProperty({
    example: [-77.0428, -12.0464],
    description: 'Coordenadas [longitud, latitud]',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  @Type(() => Number)
  coordinates: number[];
}

export class CreateProductorProfileDto {
  @ApiProperty({
    example: 'Frutas del Valle',
    description: 'Nombre del negocio o emprendimiento',
  })
  @IsNotEmpty()
  @IsString()
  nombreNegocio: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre de la persona de contacto',
  })
  @IsNotEmpty()
  @IsString()
  nombreContacto: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Fundo La Esperanza, Km 25 Carretera Central',
    description: 'Dirección del productor',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    description: 'Ubicación geográfica (GeoJSON Point)',
    type: UbicacionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion?: UbicacionDto;

  @ApiPropertyOptional({
    example: 'Producimos frutas orgánicas de la mejor calidad, cultivadas sin pesticidas.',
    description: 'Descripción del negocio',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: ['organico', 'comercio-justo', 'agricultura-familiar'],
    description: 'Certificaciones del productor',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificaciones?: string[];

  @ApiPropertyOptional({
    example: ['frutas', 'verduras'],
    description: 'Categorías de productos que ofrece',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categorias?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del perfil',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Si el productor ha sido verificado por un administrador',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;
}
