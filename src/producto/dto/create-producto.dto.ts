import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

const UNIDADES = ['kg', 'unidad', 'litro', 'docena'] as const;

export class CreateProductoDto {
  @ApiProperty({
    example: 'Nombre del Producto',
    description: 'Nombre del Producto',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: 'Descripción del Producto',
    description: 'Descripción opcional',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;

  @ApiProperty({
    example: 1500,
    description: 'Precio del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  precio: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Stock disponible',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({
    example: 'unidad',
    description: 'Unidad de medida (kg, unidad, litro, docena)',
    enum: UNIDADES,
  })
  @IsOptional()
  @IsString()
  @IsIn(UNIDADES)
  unidad?: string;

  @ApiPropertyOptional({
    example: 'frutas',
    description: 'Categoría del producto',
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Si el producto está disponible',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  disponible?: boolean;
}
