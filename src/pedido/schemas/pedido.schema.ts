import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PedidoDocument = Pedido & Document;

@Schema({ timestamps: true })
export class Pedido {
  @Prop({ type: Types.ObjectId, ref: 'Cliente', required: true })
  cliente: Types.ObjectId;

  @Prop({ type: [{ producto: { type: Types.ObjectId, ref: 'Producto' }, cantidad: Number, precio: Number }] })
  items: any;

  @Prop({ min: 0 })
  total: number;

  @Prop({ enum: ['pendiente', 'procesando', 'enviado', 'entregado'], default: 'pendiente' })
  estado?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);

PedidoSchema.index({ cliente: 1 });
PedidoSchema.index({ estado: 1 });
PedidoSchema.index({ createdAt: -1 });
