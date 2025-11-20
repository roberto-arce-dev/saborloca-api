import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ProductorProfile } from '../../productor-profile/schemas/productor-profile.schema';

export type ProductoDocument = Producto & Document;

/**
 * Producto - Ahora referencia ProductorProfile en lugar de Productor
 * Siguiendo el patrón DDD: el productor es un perfil de usuario
 */
@Schema({ timestamps: true })
export class Producto {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  descripcion?: string;

  @Prop({ min: 0, required: true })
  precio: number;

  @Prop({ enum: ['kg', 'unidad', 'litro', 'docena'], default: 'unidad' })
  unidad?: string;

  @Prop({ default: 0, min: 0 })
  stock?: number;

  @Prop({ type: Types.ObjectId, ref: 'ProductorProfile', required: true })
  productor: ProductorProfile | Types.ObjectId;

  @Prop()
  categoria?: string; // Ej: frutas, verduras, lácteos

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

  @Prop({ default: true })
  disponible?: boolean;
}

export const ProductoSchema = SchemaFactory.createForClass(Producto);

// Indexes para optimizar queries
ProductoSchema.index({ productor: 1 });
ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ disponible: 1 });
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });
