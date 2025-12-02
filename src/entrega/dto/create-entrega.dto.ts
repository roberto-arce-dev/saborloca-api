import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum EntregaEstado {
  PROGRAMADA = 'programada',
  EN_RUTA = 'en-ruta',
  ENTREGADA = 'entregada',
}

export class CreateEntregaDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del pedido asociado',
  })
  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  pedido: string;

  @ApiProperty({
    example: 'Av. Principal 123, Lima',
    description: 'Dirección donde se entregará el pedido',
  })
  @IsNotEmpty()
  @IsString()
  direccion: string;

  @ApiProperty({
    example: '2024-12-01T15:00:00.000Z',
    description: 'Fecha y hora programada para la entrega',
  })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  fechaEntrega: Date;

  @ApiPropertyOptional({
    example: 'programada',
    description: 'Estado de la entrega',
    enum: EntregaEstado,
    default: EntregaEstado.PROGRAMADA,
  })
  @IsOptional()
  @IsEnum(EntregaEstado)
  estado?: EntregaEstado;

  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nombre del repartidor asignado',
  })
  @IsOptional()
  @IsString()
  repartidor?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/imagen.jpg',
    description: 'URL de la imagen asociada a la entrega (opcional)',
  })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'URL del thumbnail de la imagen',
  })
  @IsOptional()
  @IsString()
  imagenThumbnail?: string;
}
