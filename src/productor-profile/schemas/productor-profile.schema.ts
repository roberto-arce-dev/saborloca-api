import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type ProductorProfileDocument = ProductorProfile & Document;

/**
 * ProductorProfile - Perfil específico para usuarios con rol PRODUCTOR
 *
 * Siguiendo el principio de Separation of Concerns:
 * - User maneja autenticación y roles
 * - ProductorProfile maneja datos de negocio del productor
 */
@Schema({ timestamps: true })
export class ProductorProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombreNegocio: string;

  @Prop({ required: true })
  nombreContacto: string;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  })
  ubicacion?: {
    type: string;
    coordinates: number[];
  };

  @Prop()
  avatar?: string;

  @Prop()
  avatarThumbnail?: string;

  @Prop({ type: String })
  descripcion?: string;

  @Prop({ type: [String], default: [] })
  certificaciones?: string[];

  @Prop({ type: [String], default: [] })
  categorias?: string[]; // Ej: ['frutas', 'verduras', 'lacteos']

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isVerified: boolean; // Verificado por admin
}

export const ProductorProfileSchema = SchemaFactory.createForClass(ProductorProfile);

// Indexes para optimizar queries
ProductorProfileSchema.index({ user: 1 }, { unique: true });
ProductorProfileSchema.index({ ubicacion: '2dsphere' }, { sparse: true }); // Para queries geoespaciales (sparse = solo si existe)
ProductorProfileSchema.index({ isActive: 1 });
ProductorProfileSchema.index({ isVerified: 1 });
ProductorProfileSchema.index({ categorias: 1 });
