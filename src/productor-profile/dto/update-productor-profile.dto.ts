import { PartialType } from '@nestjs/swagger';
import { CreateProductorProfileDto } from './create-productor-profile.dto';

/**
 * DTO para actualizar perfil de productor
 * Todos los campos son opcionales (extiende CreateProductorProfileDto con PartialType)
 */
export class UpdateProductorProfileDto extends PartialType(
  CreateProductorProfileDto,
) {}
