import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductorService } from './productor.service';
import { ProductorController } from './productor.controller';
import { UploadModule } from '../upload/upload.module';
import { Productor, ProductorSchema } from './schemas/productor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Productor.name, schema: ProductorSchema }]),
    UploadModule,
  ],
  controllers: [ProductorController],
  providers: [ProductorService],
  exports: [ProductorService],
})
export class ProductorModule {}
