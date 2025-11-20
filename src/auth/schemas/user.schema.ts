import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../enums/roles.enum';

export type UserDocument = User & Document;

/**
 * User Schema - Maneja solo autenticación y roles (Separation of Concerns)
 * Los datos de negocio se manejan en ClienteProfile y ProductorProfile
 */
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // No retornar password en queries por defecto
  password: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.CLIENTE,
  })
  role: Role;

  @Prop()
  avatar?: string; // URL del avatar del usuario

  @Prop({ default: true })
  isActive: boolean; // Para soft delete

  @Prop({ default: false })
  emailVerified: boolean; // Para verificación de email (futuro)
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes para optimizar queries
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
