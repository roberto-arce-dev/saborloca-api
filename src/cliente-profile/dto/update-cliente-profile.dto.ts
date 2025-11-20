import { PartialType } from '@nestjs/swagger';
import { CreateClienteProfileDto } from './create-cliente-profile.dto';

/**
 * DTO para actualizar perfil de cliente
 * Todos los campos son opcionales (extiende CreateClienteProfileDto con PartialType)
 */
export class UpdateClienteProfileDto extends PartialType(
  CreateClienteProfileDto,
) {}
