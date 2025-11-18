import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EntregaDocument = Entrega & Document;

@Schema({ timestamps: true })
export class Entrega {
  @Prop({ type: Types.ObjectId, ref: 'Pedido', required: true,  unique: true  })
  pedido: Types.ObjectId;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  fechaEntrega: Date;

  @Prop({ enum: ['programada', 'en-ruta', 'entregada'], default: 'programada' })
  estado?: string;

  @Prop()
  repartidor?: string;

  @Prop()
  imagen?: string;

  @Prop()
  imagenThumbnail?: string;

}

export const EntregaSchema = SchemaFactory.createForClass(Entrega);

EntregaSchema.index({ pedido: 1 });
EntregaSchema.index({ estado: 1 });
EntregaSchema.index({ fechaEntrega: 1 });
