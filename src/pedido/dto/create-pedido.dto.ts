import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  IsOptional,
  IsString,
  ValidateNested,
  IsMongoId,
  ArrayMinSize,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PedidoItemDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del Producto',
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  producto: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad de productos',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  cantidad: number;
}

export class CreatePedidoDto {
  @ApiPropertyOptional({
    example: '507f1f77bcf86cd799439011',
    description: 'ID del ClienteProfile (opcional, solo para ADMIN. Si no se especifica, se usa el perfil del usuario autenticado)',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  cliente?: string;

  @ApiProperty({
    type: [PedidoItemDto],
    description: 'Items del pedido',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];

  @ApiPropertyOptional({
    example: 'Calle 123, Depto 4B',
    description: 'Dirección de entrega',
  })
  @IsOptional()
  @IsString()
  direccionEntrega?: string;

  @ApiPropertyOptional({
    example: 'Tocar el timbre',
    description: 'Notas para la entrega',
  })
  @IsOptional()
  @IsString()
  notasEntrega?: string;
}
