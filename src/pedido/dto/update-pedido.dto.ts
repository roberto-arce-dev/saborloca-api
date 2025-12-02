import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum PedidoEstado {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  PREPARANDO = 'preparando',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @ApiPropertyOptional({
    example: 'confirmado',
    description: 'Estado del pedido',
    enum: PedidoEstado,
  })
  @IsOptional()
  @IsEnum(PedidoEstado)
  estado?: PedidoEstado;

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
