import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { UploadModule } from '../upload/upload.module';
import { Producto, ProductoSchema } from './schemas/producto.schema';
import { ProductorProfileModule } from '../productor-profile/productor-profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Producto.name, schema: ProductoSchema }]),
    UploadModule,
    ProductorProfileModule,
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
