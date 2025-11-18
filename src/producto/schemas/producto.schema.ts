import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductoDocument = Producto & Document;

@Schema({ timestamps: true })
export class Producto {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string;

  @Prop({ min: 0 })
  precio: number;

  @Prop({ enum: ['kg', 'unidad', 'litro', 'docena'], default: 'unidad' })
  unidad?: string;

  @Prop({ default: 0, min: 0 })
  stock?: number;

  @Prop({ type: Types.ObjectId, ref: 'Productor', required: true })
  productor: Types.ObjectId;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

ProductoSchema.index({ productor: 1 });
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });
