import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { UploadModule } from '../upload/upload.module';
import { Entrega, EntregaSchema } from './schemas/entrega.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entrega.name, schema: EntregaSchema }]),
    UploadModule,
  ],
  controllers: [EntregaController],
  providers: [EntregaService],
  exports: [EntregaService],
})
export class EntregaModule {}
