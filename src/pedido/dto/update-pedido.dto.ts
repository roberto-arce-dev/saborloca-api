import { PartialType } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @ApiPropertyOptional({
    example: 'confirmado',
    description: 'Estado del pedido',
    enum: ['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'],
  })
  @IsOptional()
  @IsEnum(['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'])
  estado?: string;

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
}
