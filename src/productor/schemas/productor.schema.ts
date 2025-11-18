import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductorDocument = Productor & Document;

@Schema({ timestamps: true })
export class Productor {
  @Prop({ required: true })
  nombre: string;

  @Prop()
  ubicacion?: string;

  @Prop()
  telefono?: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const ProductorSchema = SchemaFactory.createForClass(Productor);

ProductorSchema.index({ email: 1 });
