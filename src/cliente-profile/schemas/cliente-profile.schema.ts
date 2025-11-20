import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export type ClienteProfileDocument = ClienteProfile & Document;

/**
 * ClienteProfile - Perfil específico para usuarios con rol CLIENTE
 *
 * Siguiendo el principio de Separation of Concerns:
 * - User maneja autenticación y roles
 * - ClienteProfile maneja datos de negocio del cliente
 */
@Schema({ timestamps: true })
export class ClienteProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: User | Types.ObjectId;

  @Prop({ required: true })
  nombre: string;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
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

  @Prop({ type: [String], default: [] })
  preferencias?: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ClienteProfileSchema = SchemaFactory.createForClass(ClienteProfile);

// Indexes para optimizar queries
ClienteProfileSchema.index({ user: 1 }, { unique: true });
ClienteProfileSchema.index({ ubicacion: '2dsphere' }); // Para queries geoespaciales
ClienteProfileSchema.index({ isActive: 1 });
