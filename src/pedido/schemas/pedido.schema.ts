import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ClienteProfile } from '../../cliente-profile/schemas/cliente-profile.schema';
import { Producto } from '../../producto/schemas/producto.schema';

export type PedidoDocument = Pedido & Document;

/**
 * Item del pedido con tipado fuerte
 */
export class PedidoItem {
  @Prop({ type: Types.ObjectId, ref: 'Producto', required: true })
  producto: Producto | Types.ObjectId;

  @Prop({ required: true, min: 1 })
  cantidad: number;

  @Prop({ required: true, min: 0 })
  precio: number; // Precio unitario al momento del pedido
}

/**
 * Pedido - Ahora referencia ClienteProfile en lugar de Cliente
 * Siguiendo el patrón DDD: el cliente es un perfil de usuario
 */
@Schema({ timestamps: true })
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'ClienteProfile', required: true })
  cliente: ClienteProfile | Types.ObjectId;

  @Prop({ type: [PedidoItem], required: true })
  items: PedidoItem[];

  @Prop({ min: 0, required: true })
  total: number;

  @Prop({ enum: ['pendiente', 'confirmado', 'preparando', 'enviado', 'entregado', 'cancelado'], default: 'pendiente' })
  estado?: string;

  @Prop()
  direccionEntrega?: string;

  @Prop()
  notasEntrega?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

// Indexes para optimizar queries
PedidoSchema.index({ cliente: 1 });
PedidoSchema.index({ estado: 1 });
PedidoSchema.index({ createdAt: -1 });
