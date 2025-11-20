import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductorProfileService } from './productor-profile.service';
import { ProductorProfileController } from './productor-profile.controller';
import {
  ProductorProfile,
  ProductorProfileSchema,
} from './schemas/productor-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductorProfile.name, schema: ProductorProfileSchema },
    ]),
  ],
  providers: [ProductorProfileService],
  controllers: [ProductorProfileController],
  exports: [ProductorProfileService], // Exportar para usar en otros módulos
})
export class ProductorProfileModule {}
