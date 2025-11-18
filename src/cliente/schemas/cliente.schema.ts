import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClienteDocument = Cliente & Document;

@Schema({ timestamps: true })
export class Cliente {
  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  telefono?: string;

  @Prop()
  direccion?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);

ClienteSchema.index({ email: 1 });
