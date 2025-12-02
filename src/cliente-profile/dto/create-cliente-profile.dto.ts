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

export class CreateClienteProfileDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del cliente',
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
    description: 'Dirección del cliente',
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
    example: ['organico', 'sin-gluten', 'vegano'],
    description: 'Preferencias alimentarias del cliente',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferencias?: string[];

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo del perfil',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;
}
