import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClienteProfileService } from './cliente-profile.service';
import { ClienteProfileController } from './cliente-profile.controller';
import {
  ClienteProfile,
  ClienteProfileSchema,
} from './schemas/cliente-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClienteProfile.name, schema: ClienteProfileSchema },
    ]),
  ],
  providers: [ClienteProfileService],
  controllers: [ClienteProfileController],
  exports: [ClienteProfileService], // Exportar para usar en otros módulos
})
export class ClienteProfileModule {}
